const Joi = require('joi');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { prisma } = require("../utils/connection");
const fs = require('fs');
const path = require('path');

// Function to load the PDF template
const loadPdfTemplate = async () => {
    const fileBuffer = fs.readFileSync(`${process.cwd()}/uploads/ticket_template.pdf`);
    return fileBuffer;
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return { r, g, b };
};

// Function to fill the PDF template with ticket details
const fillPdfTemplate = async (pdfBytes, ticketDetails) => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { eventName, placeName, seatNumber } = ticketDetails;

    const { r: r1, g: g1, b: b1 } = hexToRgb('#4e4e4e'); // dark grey
    const { r: r2, g: g2, b: b2 } = hexToRgb('#d79922'); // orange

    // Replace placeholders with actual values using the provided coordinates
    firstPage.drawText(eventName, {
        x: 59,
        y: firstPage.getHeight() - 48, // Invert y-coordinate
        size: 10,
        font: helveticaFont,
        color: rgb(r1, g1, b1),
    });
    firstPage.drawText(placeName, {
        x: 59,
        y: firstPage.getHeight() - 69, // Invert y-coordinate
        size: 10,
        font: helveticaFont,
        color: rgb(r1, g1, b1),
    });
    firstPage.drawText(seatNumber, {
        x: 220,
        y: firstPage.getHeight() - 30, // Invert y-coordinate
        size: 12,
        font: helveticaFont,
        color: rgb(r2, g2, b2),
    });

    const filledPdfBytes = await pdfDoc.save();
    return filledPdfBytes;
};

const buy = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const carts = await prisma.carts.findMany({
            where: { userId },
            include: { event: { include: { place: true } } }
        });

        if (!carts.length) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        let emptySeatsByRows = [];
        let boughtTickets = [];
        let pdfBuffers = [];

        // Load the PDF template
        const pdfTemplateBytes = await loadPdfTemplate();

        for (const cart of carts) {
            const findPlace = cart.event.place;
            const tickets = await prisma.tickets.findMany({ where: { eventId: cart.eventId } });

            const totalSeats = findPlace.rows * findPlace.columns;
            const takenSeats = new Set(tickets.map(ticket => ticket.seatNumber));
            const rowNumber = cart.rowNumber;
            const startSeatNumber = rowNumber * 100;
            const endSeatNumber = startSeatNumber + findPlace.columns;

            let availableSeats = [];
            for (let i = startSeatNumber; i < endSeatNumber; i++) {
                if (!takenSeats.has(i)) {
                    availableSeats.push(i);
                }
            }

            if (availableSeats.length < cart.quantity) {
                emptySeatsByRows = getEmptySeatsByRows(findPlace, tickets);
                return res.status(400).json({
                    message: `No enough seats are available for row ${rowNumber}`,
                    emptySeatsInRows: emptySeatsByRows
                });
            }

            // Create tickets for the available seats
            for (let j = 0; j < cart.quantity; j++) {
                const createdTicket = await prisma.tickets.create({
                    data: {
                        seatNumber: availableSeats[j],
                        userId,
                        eventId: cart.eventId
                    }
                });
                boughtTickets.push(createdTicket);

                // Fill the PDF template with ticket details
                const filledPdfBytes = await fillPdfTemplate(pdfTemplateBytes, {
                    seatNumber: availableSeats[j].toString(),
                    eventName: cart.event.name,
                    placeName: findPlace.name
                });

                // Store the filled PDF buffer for later use
                pdfBuffers.push(filledPdfBytes);
            }
        }

        // Delete all cart items related to the user
        await prisma.carts.deleteMany({ where: { userId } });

        // Combine all PDF buffers into one PDF document
        const combinedPdfDoc = await PDFDocument.create();
        for (const pdfBytes of pdfBuffers) {
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const [pdfPage] = await combinedPdfDoc.copyPages(pdfDoc, [0]);
            combinedPdfDoc.addPage(pdfPage);
        }
        const combinedPdfBytes = await combinedPdfDoc.save();

        // Send the combined PDF as a response for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=tickets.pdf');
        res.send(Buffer.from(combinedPdfBytes));
    } catch (error) {
        next(error);
    }
};

// Function to calculate empty seats by rows
const getEmptySeatsByRows = (place, tickets) => {
    let emptySeatsByRows = [];
    for (let row = 1; row <= place.rows; row++) {
        const startSeatNumber = row * 100;
        const endSeatNumber = startSeatNumber + place.columns;
        let rowEmptySeats = 0;

        for (let seat = startSeatNumber; seat < endSeatNumber; seat++) {
            if (!tickets.some(ticket => ticket.seatNumber === seat)) {
                rowEmptySeats++;
            }
        }

        if (rowEmptySeats > 0) {
            emptySeatsByRows.push(row);
        }
    }
    return emptySeatsByRows;
};

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const carts = await prisma.carts.findMany({
            where: { userId },
            select: {
                id: true,
                event: true,
                quantity: true,
                rowNumber: true,
                totalPrice: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // Calculate the total price of all personal carts
        const totalPrice = carts.reduce((acc, cart) => acc + cart.totalPrice, 0);

        res.json({ data: carts, totalPrice });
    } catch (error) {
        next(error);
    }
};

const updateCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, rowNumber } = req.body;

        // Validate request body
        const schema = Joi.object({
            quantity: Joi.number().required(),
            rowNumber: Joi.number().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // Find the cart item with the event and user details
        const cart = await prisma.carts.findFirst({
            where: { id },
            include: {
                event: true,
                user: true,
            }
        });
        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Find the place related to the event
        const findPlace = await prisma.places.findUnique({
            where: {
                id: cart.event.placeId,
            }
        });
        if (rowNumber > findPlace.rows) {
            return res.status(400).json({ message: `rowNumber should be less than or equal to ${findPlace.rows}` });
        }

        // Calculate total price
        const totalPrice = (findPlace.firstRowPrice - findPlace.priceDifByRow * (rowNumber - 1)) * quantity;

        // Update the cart item using the composite unique key
        const updatedCart = await prisma.carts.update({
            where: {
                userId_eventId_id: {
                    userId: cart.userId,
                    eventId: cart.eventId,
                    id: cart.id
                }
            },
            data: {
                quantity,
                rowNumber,
                totalPrice
            }
        });

        res.json({ message: "Cart item updated successfully", data: updatedCart });
    } catch (error) {
        next(error);
    }
};

const removeCart = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the cart item with the event and user details
        const cart = await prisma.carts.findFirst({
            where: { id },
            include: {
                event: true,
                user: true,
            }
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Delete the cart item using the composite unique key
        await prisma.carts.delete({
            where: {
                userId_eventId_id: {
                    userId: cart.userId,
                    eventId: cart.eventId,
                    id: cart.id
                }
            }
        });

        res.json({ message: "Cart item removed successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    updateCart,
    removeCart,
    buy
};
