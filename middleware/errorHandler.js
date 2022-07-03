import { StatusCodes } from 'http-status-codes'
import { global_env } from '../index.js'

const errorHandler = (err, req, res, next) => {
  let customError = {
    status: err.code || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: global_env === 'production' ? null: err.message || 'Something went wrong try again later',
  }
    res.status(err.code || 500)
    res.send(customError)
  }

export default errorHandler