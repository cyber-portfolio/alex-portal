import express from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  updateOrder,
} from '../controllers/ordersController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(createOrder)
  .get(getOrders)

router
  .route('/:id')
  .delete(protect, admin, deleteOrder)
  .get(getOrder)
  .patch(protect, admin, updateOrder)

export default router