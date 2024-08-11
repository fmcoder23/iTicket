const Joi = require('joi');
const { prisma } = require("../utils/connection")
const { v4: uuid } = require('uuid')
const path = require('path')

const createBanner = async (req, res, next) => {
    try {
        const { eventId } = req.body;

        if (!req.files) {
            return res.status(400).json({ message: "Photo is required" });
        }
        if (req.files && !req.files.photo) {
            return res.status(400).json({ message: "Photo is required" });
        }

        const { photo } = req.files;

        const schema = Joi.object({
            eventId: Joi.string().required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findEvent = await prisma.events.findUnique({ where: { id: eventId } });
        if (!findEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        const photoName = `${uuid()}${path.extname(photo.name)}`;
        photo.mv(`${process.cwd()}/uploads/${photoName}`);

        const newBanner = await prisma.banners.create({
            data: {
                eventId,
                photo: photoName,
            },
        })
        res.status(201).json({ message: "Banner successfully created", data: newBanner })

    } catch (error) {
        next(error)
    }
}

const showBanners = async (req, res, next) => {
    try {
        const banners = await prisma.banners.findMany({
            include: {
                event: true
            }
        });
        res.json({ data: banners })
    } catch (error) {
        next(error)
    }
}

const updateBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { eventId } = req.body;

        const schema = Joi.object({
            eventId: Joi.string(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const banner = await prisma.banners.findUnique({ where: { id } });
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        if (eventId) {
            const findEvent = await prisma.events.findUnique({ where: { id: eventId } });
            if (!findEvent) {
                return res.status(404).json({ message: "Event not found" });
            }
        }

        let photoName = undefined;
        if (req.files) {
            const { photo } = req.files;
            photoName = `${uuid()}${path.extname(photo.name)}`;
            photo.mv(`${process.cwd()}/uploads/${photoName}`);
        }

        const updatedBanner = await prisma.banners.update({
            where: { id },
            data: {
                eventId,
                photo: photoName,
            },
        })
        res.json({ message: "Banner successfully updated", data: updatedBanner })
    } catch (error) {
        next(error)
    }
}

const removeBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const banner = await prisma.banners.findUnique({ where: { id } });
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        await prisma.banners.delete({ where: { id } })
        res.json({ message: "Banner successfully deleted" })
    } catch (error) {
        next(error)
    }
}

module.exports = { createBanner, showBanners, updateBanner, removeBanner }