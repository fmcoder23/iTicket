const Joi = require('joi');
const { prisma } = require("../utils/connection")

const createPlace = async (req, res, next) => {
    try {
        const { name, rows, columns, priceDifByRow, firstRowPrice } = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
            rows: Joi.number().required(),
            columns: Joi.number().required(),
            priceDifByRow: Joi.number().required(),
            firstRowPrice: Joi.number().required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findPlace = await prisma.places.findUnique({ where: { name } })
        if (findPlace) {
            return res.status(400).json({ message: "Place already exists" });
        }

        const newPlace = await prisma.places.create({
            data: {
                name,
                rows,
                columns,
                priceDifByRow,
                firstRowPrice,
            },
        })

        res.status(201).json({ message: "Place successfully created", data: newPlace })
    } catch (error) {
        next(error)
    }
}

const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, rows, columns, priceDifByRow, firstRowPrice } = req.body;

        const schema = Joi.object({
            name: Joi.string(),
            rows: Joi.number(),
            columns: Joi.number(),
            priceDifByRow: Joi.number(),
            firstRowPrice: Joi.number(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const place = await prisma.places.findUnique({ where: { id } })
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        const findPlace = await prisma.places.findUnique({ where: { name } })
        if (findPlace && findPlace.id !== id) {
            return res.status(400).json({ message: "Place already exists" });
        }

        const updatedPlace = await prisma.places.update({
            where: { id },
            data: {
                name,
                rows,
                columns,
                priceDifByRow,
                firstRowPrice,
            },
        })
        res.json({ message: "Place successfully updated", data: updatedPlace })
    } catch (error) {
        next(error)
    }
}

const removePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await prisma.places.findUnique({ where: { id } })
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }
        await prisma.places.delete({ where: { id } })
        res.json({ message: "Place successfully deleted" })
    } catch (error) {
        next(error)
    }
}

const showPlace = async (req, res, next) => {
    try {
        const places = await prisma.places.findMany({
            select: {
                id: true,
                name: true,
                rows: true,
                columns: true,
                priceDifByRow: true,
                firstRowPrice: true,
                createdAt: true,
                updatedAt: true,
                events: true,
            }
        });
        res.json({ data: places })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPlace,
    updatePlace,
    removePlace,
    showPlace,
}