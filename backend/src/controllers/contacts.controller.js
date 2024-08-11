const Joi = require('joi');
const { prisma } = require("../utils/connection")

const createContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { phone, message } = req.body;

        const schema = Joi.object({
            phone: Joi.string().min(13).max(13).required(),
            message: Joi.string().required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const newContact = await prisma.contacts.create({
            data: {
                userId,
                phone,
                message,
            },
        })
        res.status(201).json({ message: "Contact successfully created", data: newContact })

    } catch (error) {
        next(error)
    }
}

const getContacts = async (req, res, next) => {
    try {
        const contacts = await prisma.contacts.findMany({
            include: {
                user: true,
            },
        })
        res.json({ data: contacts })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createContact,
    getContacts,
}