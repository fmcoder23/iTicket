const Joi = require('joi');
const { prisma } = require("../utils/connection");
const { v4: uuid } = require('uuid')
const path = require('path')

const createTestimonial = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log(req.body)
        if (!req.files) {
            return res.status(400).json({ message: "Photo is required" });
        }
        if (req.files && !req.files.photo) {
            return res.status(400).json({ message: "Photo is required" });
        }

        const { photo } = req.files;
        const { text, rank } = req.body;

        const schema = Joi.object({
            text: Joi.string().max(230).required(),
            rank: Joi.number().min(1).max(5).required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findTestimonial = await prisma.testimonials.findFirst({ where: { userId } })
        if (findTestimonial) {
            return res.status(400).json({ message: "You already have a testimonial" });
        }

        const photoName = `${uuid()}${path.extname(photo.name)}`;
        photo.mv(`${process.cwd()}/uploads/${photoName}`);

        const newTestimonial = await prisma.testimonials.create({
            data: {
                userId,
                text,
                rank: +rank,
                photo: photoName,
            },
        })
        res.status(201).json({ message: "Testimonial successfully created", data: newTestimonial })

    } catch (error) {
        next(error);
    }
}

const showTestimonials = async (req, res, next) => {
    try {
        const testimonials = await prisma.testimonials.findMany({
            include: {
                user: {
                    select: {
                        fullname: true,
                    }
                }
            }
        });
        res.json({ data: testimonials })
    } catch (error) {
        next(error);
    }
}

const updateTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { text, rank } = req.body;

        const schema = Joi.object({
            text: Joi.string().max(230),
            rank: Joi.number().min(1).max(5),
        })
        const { error } = schema.validate({text,rank});
        if (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message });
        }

        let photoName = undefined;
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            photoName = `${uuid()}${path.extname(photo.name)}`;
            photo.mv(`${process.cwd()}/uploads/${photoName}`);
        }

        const testimonial = await prisma.testimonials.findUnique({ where: { id, userId } });
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        const updatedTes = await prisma.testimonials.update({
            where: { id },
            data: { text, rank:+rank, photo: photoName },
        })
        res.json({ message: "Testimonial successfully updated", data: updatedTes })

    } catch (error) {
        next(error);
    }
}

const removeTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const testimonial = await prisma.testimonials.findUnique({ where: { id, userId } });
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        await prisma.testimonials.delete({ where: { id } })
        res.json({ message: "Testimonial successfully deleted" })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createTestimonial,
    showTestimonials,
    updateTestimonial,
    removeTestimonial,
}