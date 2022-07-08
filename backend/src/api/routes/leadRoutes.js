import express from 'express'
import {
  createLead,
  getLead,
  getLeads,
  deleteLead,
  updateLead,
  claimLead,
  returnLead,
} from '../controllers/leadsController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
//import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(createLead)
  .get(getLeads)

router
  .route('/:id')
  .delete(protect, admin, deleteLead)
  .get(getLead)
  .put(protect, admin, updateLead)

router 
    .route('/claim/:id')
    .patch(protect, claimLead)

router 
    .route('/return/:id')
    .patch(protect, admin, returnLead)

export default router