import { StatusCodes } from "http-status-codes"

const notFound = (req, res) => {
    let customError = {
        status: StatusCodes.NOT_FOUND,
        msg: 'NotFound: Route does not exist.',
    }
    return res.status(StatusCodes.NOT_FOUND).json(customError)
} 

export default notFound