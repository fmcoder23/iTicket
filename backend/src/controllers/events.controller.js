const Joi = require('joi');
const { prisma } = require("../utils/connection")
const { v4: uuid } = require('uuid')
const path = require('path');

const createEvent = async (req, res, next) => {
    try {
        const { name, description, datetime, phone1, phone2, placeId, categoryId } = req.body;
        if (!req.files) {
            return res.status(400).json({ message: "Photo is required" });
        }
        if (req.files && !req.files.photo) {
            return res.status(400).json({ message: "Photo is required" });
        }
        const { photo } = req.files;

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().max(240).required(),
            datetime: Joi.date().required(),
            phone1: Joi.string().min(13).max(13).required(),
            phone2: Joi.string().min(13).max(13).required(),
            placeId: Joi.string().required(),
            categoryId: Joi.string().required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findPlace = await prisma.places.findUnique({ where: { id: placeId } })
        if (!findPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        const findCategory = await prisma.categories.findUnique({ where: { id: categoryId } })
        if (!findCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const photoName = `${uuid()}${path.extname(photo.name)}`;
        photo.mv(`${process.cwd()}/uploads/${photoName}`);

        const newEvent = await prisma.events.create({
            data: {
                name,
                description,
                datetime: new Date(datetime).toISOString(),
                phone1,
                phone2,
                placeId,
                categoryId,
                photo: photoName,
            },
        })
        res.status(201).json({ message: "Event successfully created", data: newEvent })
    } catch (error) {
        next(error);
    }
}

const showEvents = async (req, res, next) => {
    try {
        const { placeId, startDate, endDate, categoryId, minPrice, maxPrice } = req.query;

        const filters = {};

        if (placeId) {
            filters.placeId = placeId;
        }

        if (startDate && endDate) {
            filters.datetime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            filters.datetime = {
                gte: new Date(startDate),
            };
        } else if (endDate) {
            filters.datetime = {
                lte: new Date(endDate),
            };
        }

        if (categoryId) {
            filters.categoryId = categoryId;
        }

        let events = await prisma.events.findMany({
            where: filters,
            select: {
                id: true,
                name: true,
                description: true,
                datetime: true,
                phone1: true,
                phone2: true,
                createdAt: true,
                updatedAt: true,
                place: true,
                category: true,
            }
        });

        // Calculate minimum price for each event and apply price filtering
        events = await Promise.all(events.map(async event => {
            const place = event.place;
            const minEventPrice = place.firstRowPrice - place.priceDifByRow * (place.rows - 1);
            return {
                ...event,
                minEventPrice,
            };
        }));

        if (minPrice) {
            events = events.filter(event => event.minEventPrice >= parseFloat(minPrice));
        }
        if (maxPrice) {
            events = events.filter(event => event.minEventPrice <= parseFloat(maxPrice));
        }

        res.json({ data: events });
    } catch (error) {
        next(error);
    }
};

const showEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await prisma.events.findUnique({
            where: { id }, select: {
                id: true,
                name: true,
                description: true,
                datetime: true,
                phone1: true,
                phone2: true,
                createdAt: true,
                updatedAt: true,
                place: true,
                category: true,
            }
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({ data: event })
    } catch (error) {
        next(error);
    }
}

const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { name, description, datetime, phone1, phone2, placeId, categoryId } = req.body;

        if (datetime) {
            datetime = new Date(datetime).toISOString()
        }

        const schema = Joi.object({
            name: Joi.string(),
            description: Joi.string(),
            datetime: Joi.date(),
            phone1: Joi.string(),
            phone2: Joi.string(),
            placeId: Joi.string(),
            categoryId: Joi.string(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        if (placeId) {
            const findPlace = await prisma.places.findUnique({ where: { id: placeId } })
            if (!findPlace) {
                return res.status(404).json({ message: "Place not found" });
            }
        }

        if (categoryId) {
            const findCategory = await prisma.categories.findUnique({ where: { id: categoryId } })
            if (!findCategory) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        let photoName = undefined;
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            photoName = `${uuid()}${path.extname(photo.name)}`;
            photo.mv(`${process.cwd()}/uploads/${photoName}`);
        }

        const updatedEvent = await prisma.events.update({
            where: { id },
            data: {
                name,
                description,
                datetime,
                phone1,
                phone2,
                placeId,
                categoryId,
                photo: photoName,
            },
        })
        res.json({ message: "Event successfully updated", data: updatedEvent })
    } catch (error) {
        next(error);
    }
}

const removeEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await prisma.events.findUnique({ where: { id } })
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        await prisma.events.delete({ where: { id } })
        res.json({ message: "Event successfully deleted" })
    } catch (error) {
        next(error);
    }
}

const addToCart = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const { quantity, rowNumber } = req.body;

        const schema = Joi.object({
            quantity: Joi.number().required(),
            rowNumber: Joi.number().required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const event = await prisma.events.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const findCartItem = await prisma.carts.findFirst({
            where: { userId, eventId },
        });
        if (findCartItem) {
            return res.status(400).json({ message: "Event already in cart" });
        }

        const findPlace = await prisma.places.findUnique({
            where: {
                id: event.placeId,
            }
        })

        if (rowNumber > findPlace.rows) {
            return res.status(400).json({ message: `rowNumber should be less than or equal to ${findPlace.rows}` });
        }

        const totalPrice = (findPlace.firstRowPrice - findPlace.priceDifByRow * (rowNumber - 1)) * quantity;

        const cart = await prisma.carts.create({
            data: {
                userId,
                eventId,
                quantity,
                rowNumber,
                totalPrice
            },
        });

        res.json({ message: "Event added to cart successfully", data: cart });
    } catch (error) {
        next(error);
    }
}

const addToFavorite = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const schema = Joi.object({
            eventId: Joi.string().required(),
        })
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const event = await prisma.events.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const findFavorite = await prisma.favorites.findFirst({
            where: { userId, eventId },
        });
        if (findFavorite) {
            return res.status(400).json({ message: "Event already in favorites" });
        }
        await prisma.favorites.create({
            data: {
                userId,
                eventId,
            },
        });
        res.json({ message: "Event added to favorites successfully" });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createEvent,
    showEvents,
    showEventById,
    updateEvent,
    removeEvent,
    addToCart,
    addToFavorite
}
