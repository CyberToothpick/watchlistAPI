import { StatusCodes } from 'http-status-codes'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import { token_secret } from '../index.js'

//*________________________________________________

const addMovie = async (id) => {
    try {
        const url = `http://www.omdbapi.com/?apikey=73af3a82&i=${id}`
        const response = await axios.get(url)
        const formatted_data = {
            imdbID: response.data.imdbID,
            Title: response.data.Title,
            Year: response.data.Year,
            Poster: response.data.Poster,
        }

        return formatted_data
    } catch (e) {
        return new Error(e)
    }
}

//*________________________________________________

export const viewWatchlist = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            const error = new Error('Unauthorized: User is not authorized.')
            error.code = StatusCodes.UNAUTHORIZED
            return next(error)
        }
        const { id } = jwt.verify(token, token_secret)
        const user = await User.findById(id)
        const watchlist = user.watchlist

        return res.status(StatusCodes.OK).json(watchlist)
    } catch (e) {
        return next(new Error(e))
    }
}

export const addToWatchlist = async (req, res, next) => {
    try {
        const movieId = req.params.id
        if (!movieId) {
            const error = new Error('Forbidden: Please provide movie id.')
            error.code = StatusCodes.FORBIDDEN
            return next(error)
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            const error = new Error('Unauthorized: User is not authorized.')
            error.code = StatusCodes.UNAUTHORIZED
            return next(error)
        }
        const { id } = jwt.verify(token, token_secret)
        const response = await addMovie(movieId)
        await User.findOneAndUpdate({
            _id: id
        }, {
            $addToSet: {
                watchlist: response
            }
        })

        res.status(StatusCodes.OK).json('OK: Added to watchlist.')
    } catch (e) {
        return next(new Error(e))
    }
}

export const deleteFromWatchlist = async (req, res, next) => {
    try {
        const movieId = req.params.id
        if (!movieId) {
            const error = new Error('Forbidden: Please provide movie id.')
            error.code = StatusCodes.FORBIDDEN
            return next(error)
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            const error = new Error('Unauthorized: User is not authorized.')
            error.code = StatusCodes.UNAUTHORIZED
            return next(error)
        }
        const { id } = jwt.verify(token, token_secret)
        await User.findOneAndUpdate({
            _id: id
        }, {
            $pull: {
                watchlist: { imdbID: movieId }
            }
        })

        res.status(StatusCodes.OK).json('OK: Deleted from watchlist.')
    } catch (e) {
        return next(new Error(e))
    }
}

//*________________________________________________