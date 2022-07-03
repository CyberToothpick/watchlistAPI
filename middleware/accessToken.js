import jwt from 'jsonwebtoken'

import { token_secret } from '../index.js'

//*________________________________________________

export const generateAccessToken = (id, roles) => {
    const payload = { id, roles }

    return jwt.sign(payload, token_secret, {expiresIn: '24h'})
}