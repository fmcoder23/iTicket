const Joi = require('joi');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const { prisma } = require('../utils/connection');
const { sendMail, sendResetPass } = require('../utils/mail');
const { createToken } = require('../utils/jwt');

const register = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;

        const schema = Joi.object({
            fullname: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            console.log(error.message)
            return res.status(400).json({ message: error.message });
        }

        const userExists = await prisma.users.findUnique({ where: { email } })
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const code = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            digits: true,
        });

        const findUser = await prisma.otps.findFirst({ where: { email } })
        if (findUser) {
            await prisma.otps.update({
                where: { email }, data: {
                    code
                }
            })
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.otps.create({
                data: {
                    fullname,
                    email,
                    password: hashedPassword,
                    code,
                }
            })
            
        }
        
        await sendMail(email, code);
        res.json({ message: "Verification code has been sent to your email" })

    } catch (error) {
        next(error);
    }
}

const verify = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        console.log(req.body)
        const schema = Joi.object({
            email: Joi.string().email().required(),
            code: Joi.string().min(6).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findUser = await prisma.otps.findFirst({ where: { email, code } })
        if (!findUser) {
            return res.status(400).json({ message: "Invalid email or code" });
        }

        const user = await prisma.users.create({
            data: {
                fullname: findUser.fullname,
                email: findUser.email,
                password: findUser.password,
            }
        })

        await prisma.otps.delete({ where: { id: findUser.id } })

        const token = createToken({ id: user.id, isAdmin: user.isAdmin })
        res.json({ message: "User registered successfully", token, user });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = createToken({ id: user.id, isAdmin: user.isAdmin })
        res.json({ message: "User logged in successfully", token, user });
    } catch (error) {
        next(error);
    }
}

const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const user = await prisma.users.findFirst({ where: { email, isAdmin: true } })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = createToken({ id: user.id, isAdmin: user.isAdmin })
        res.json({ message: "Admin logged in successfully", token, userId: user.id });

    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const schema = Joi.object({
            email: Joi.string().email().required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        await sendResetPass(email);
        res.json({ message: "Reset password link has been sent to your email" })
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        })
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        await prisma.users.update({
            where: { email },
            data: { password: await bcrypt.hash(password, 12) }
        })
        res.json({ message: "Password reset successfully" })

    } catch (error) {
        next(error);
    }
}

module.exports = { register, verify, login, adminLogin, resetPassword, forgotPassword };