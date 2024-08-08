const Joi = require('joi');
const { prisma } = require("../utils/connection")
const bcrypt = require('bcrypt');

const createUser = async (req, res, next) => {
    try {
        const { fullname, email, password, isAdmin } = req.body;

        const schema = Joi.object({
            fullname: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required(),
            isAdmin: Joi.boolean().default(false),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findUser = await prisma.users.findUnique({ where: { email } })
        if (findUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.users.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                isAdmin,
            },
        })
        res.status(201).json({ message: "User successfully created", data: newUser })
    } catch (error) {
        next(error);
    }
}

const showUser = async (req, res, next) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                fullname: true,
                email: true,
                isAdmin: true,
            }
        })

        res.json({ data: users })
    } catch (error) {
        next(error);
    }
}

const showUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ data: user })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fullname, email, password, isAdmin } = req.body;

        const schema = Joi.object({
            fullname: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().min(5),
            isAdmin: Joi.boolean(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const findUser = await prisma.users.findUnique({ where: { email } })
        if (findUser && findUser.id!== id) {
            return res.status(400).json({ message: "Email already exists" });
        }

        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                fullname,
                email,
                password: hashedPassword,
                isAdmin,
            },
        })

        res.json({ message: "User successfully updated", data: updatedUser })
    } catch (error) {
        next(error);
    }
}

const removeUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await prisma.users.delete({ where: { id } })
        res.json({ message: "User successfully deleted" })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    showUser,
    updateUser,
    removeUser,
    showUserById,
}