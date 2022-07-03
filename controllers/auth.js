import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'

import User from '../models/user.js'
import { generateAccessToken } from '../middleware/accessToken.js'

//*________________________________________________

export const register = async (req, res, next) => {
    try {
        const validatorError = validationResult(req)
        if (!validatorError.isEmpty()) {
            const error = new Error("ValidationError: password: Path `password` is shorter than the minimum allowed length (6).")
            error.code = StatusCodes.BAD_REQUEST
            return next(error)
        }
        const { login, password } = req.body
        if (!login || !password) {
            const error = new Error('ValidationError: Please provide login and password.')
            error.code = StatusCodes.BAD_REQUEST
            return next(error)
        }
        const candidate = await User.findOne({ login })
        if (candidate) {
            const error = new Error(`ValidationError: User with username (${login}) already exist. Please provide unique username.`)
            error.code = StatusCodes.BAD_REQUEST
            return next(error)
        }
        const hashPassword = bcrypt.hashSync(password, 8)
        const user = new User({
            login, password: hashPassword
        })

        await user.save()
        res.status(StatusCodes.CREATED).json(user)
    } catch (e) {
        return next(new Error(e))
    }
}

export const login = async (req, res, next) => {
    try {
        const { login, password } = req.body
        const user = await User.findOne({ login })
        if (!user) {
            const error = new Error('BadRequest: User with provided login not found.')
            error.code = StatusCodes.BAD_REQUEST
            return next(error)
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            const error = new Error('BadRequest: Provided password is incorrect.')
            error.code = StatusCodes.BAD_REQUEST
            return next(error)
        }
        const token = generateAccessToken(user._id)
        return res.json({ token })
    } catch (e) {
        return next(new Error(e))
    }
}

export const authCheck = async (req, res, next) => {
    try {
        const token = generateAccessToken(req.user.id, req.user.login)
        return res.json({ token })
    } catch (e) {
        return next(new Error(e))
    }
}

//*________________________________________________