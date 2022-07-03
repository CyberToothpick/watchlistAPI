import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

import { token_secret } from '../index.js'

//*________________________________________________

const authorized = (req, res, next) => {
    if (req.method == 'OPTIONS'){ next() }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            const error = new Error('Unauthorized: User is not authorized.')
            error.code = StatusCodes.UNAUTHORIZED
            return next(error)
        }
        const decodedData = jwt.verify(token, token_secret)
        req.user = decodedData

        next()
    } catch (e) {
        const error = new Error('Unauthorized: User is not authorized.')
        error.code = StatusCodes.UNAUTHORIZED
        return next(error)
    }
}

export default authorized
