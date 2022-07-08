import express from 'express'
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  logHistory,
  forgotPassword,
  resetPassword,
  guestRegisterUser,
  claimLead,
  returnLead,
  addUserCredits,
} from '../controllers/usersController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, registerUser)
  .get(protect, admin, getUsers)
router.route('/register/guest').post(guestRegisterUser)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resetToken').put(resetPassword)

router.route('/login').post(authUser)
router.route('/logs').get(protect, admin, logHistory)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, getUserById)
  .put(protect, admin, updateUser)

router 
    .route('/claim/:id')
    .patch(protect, claimLead)

router 
    .route('/return/:id')
    .patch(protect, admin, returnLead)

router 
    .route('/add/credits/:id')
    .patch(addUserCredits)

export default router
