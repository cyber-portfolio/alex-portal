import mongoose from 'mongoose'

const leadScheme = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
    },
    skills: {
      type: String,
    },
    time: {
      type: String,
    },
    date: {
      type: String,
    },
    dateAppt: {
      type: String,
    },
    timezone: {
      type: String,
    },
    budget: {
      type: String,
    },
    leadfunnel: {
      type: String,
    },
    type: {
      type: String,
    },
    websiteUrl: {
      type: String,
    },
    comments: {
      type: String,
    },
    credits: {
      type: Number,
      required: true,
    },
    claimed: {
      type: Boolean,
      required: true,
      default: false,
    },
    returned: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const Lead = mongoose.model('Lead', leadScheme)
export default Lead