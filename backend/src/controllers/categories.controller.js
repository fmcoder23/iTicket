const Joi = require('joi');
const { prisma } = require("../utils/connection")

const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findCategory = await prisma.categories.findUnique({ where: { name } })
        if (findCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = await prisma.categories.create({
            data: {
                name,
            },
        })

        res.status(201).json({ message: "Category successfully created", data: newCategory })
    } catch (error) {
        next(error);
    }
}

const showCategory = async (req, res, next) => {
    try {
        const categories = await prisma.categories.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                events: true,
            }
        })
        res.json({ data: categories })
    } catch (error) {
        next(error);
    }
}

const showCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await prisma.categories.findUnique({
            where: { id }, select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                events: true,
            }
        })
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ data: category })
    } catch (error) {
        next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const schema = Joi.object({
            name: Joi.string(),
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const category = await prisma.categories.findUnique({ where: { id } })
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const findCategory = await prisma.categories.findUnique({ where: { name } })
        if (findCategory && findCategory.id !== id) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const updatedCategory = await prisma.categories.update({
            where: { id },
            data: {
                name,
            },
        })
        res.json({ message: "Category successfully updated", data: updatedCategory })
    } catch (error) {
        next(error);
    }
}

const removeCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await prisma.categories.findUnique({ where: { id } })
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await prisma.categories.delete({ where: { id } })
        res.json({ message: "Category successfully deleted" })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCategory,
    showCategory,
    updateCategory,
    removeCategory,
    showCategoryById,
}