import { Router } from 'express'
import { check } from 'express-validator'

import { register, login, authCheck } from '../controllers/auth.js'
import authorized from '../middleware/authentication.js'

//*________________________________________________

const router = Router()

//*________________________________________________

router.post(
  '/register',
  check('password').isLength({ min: 5, max: 40 }),
  register
)

router.post('/login', login)

router.get('/auth', authorized, authCheck)

//*________________________________________________

export default router
