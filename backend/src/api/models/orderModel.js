import mongoose from 'mongoose'

const orderScheme = mongoose.Schema(
  {
    credits: {
      type: String,
      required: true,
    },
    status_url: {
      type: String,
      required: true,
    },
    qrcode_url: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    crypto: {
      type: String,
      required: true,
    },
    txn_id: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderScheme)
export default Order