import { Router } from 'express'

import { viewWatchlist, addToWatchlist, deleteFromWatchlist } from '../controllers/movie.js'
import authorized from '../middleware/authentication.js'

//*________________________________________________

const router = Router()

//*________________________________________________

router.get('/', authorized, viewWatchlist)

router.post('/add/:id', authorized, addToWatchlist)

router.post('/delete/:id', authorized, deleteFromWatchlist)

//*________________________________________________

export default router