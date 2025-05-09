import express from 'express'
import { templateControllers } from '../controllers/templateControllers.js'

const router = express.Router()

router.get('/template-routes', templateControllers)

export default router
