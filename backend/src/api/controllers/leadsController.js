import Lead from "../models/leadModel.js";
import asyncHandler from 'express-async-handler'

export const createLead = asyncHandler(async (req, res) => {
    const { name, email, credits } = req.body
    const userExist = await Lead.findOne({ email })
    if (userExist) {
      res.status(400)
      throw new Error('Lead email has already been used. ')
    }
  
    const leadCreate = await Lead.create({
      name,
      email,
      credits,
      claimed: false
    })
  
    if (leadCreate) {
      res.status(201).json({
        _id: leadCreate._id,
        name: leadCreate.name,
        email: leadCreate.email,
        credits: leadCreate.credits,
        claimed: leadCreate.claimed,
      })
    } else {
      res.status(400)
      throw new Error('Invalid lead data')
    }
  })

export const getLead = asyncHandler(async (req, res) => {
    const _id = req.params.id
    const lead = await Lead.findById(_id)
    if (lead) {
      res.json({
        _id: lead._id,
        name: lead.name,
        email: lead.email,
        claimed: lead.claimed,
      })
    } else {
      res.status(404)
      throw new Error('No found lead')
    }
  })
  
  export const getLeads = asyncHandler(async (req, res) => {
    let query = Lead.find()
  
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 50
    const skip = (page - 1) * pageSize
    const total = await Lead.countDocuments()
  
    const pages = Math.ceil(total / pageSize)
  
    query = query.skip(skip).limit(pageSize).sort({ createdAt: -1 })
  
    const result = await query
  
    res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  })

  export const deleteLead = asyncHandler(async (req, res) => {
    const user = await Lead.findById(req.params.id)
  
    if (req.params.id == req.user._id) {
      res.status(400)
      throw new Error("You can't delete your own user in the admin area.")
    }
  
    if (user) {
      await user.remove()
      res.json({ message: 'User removed' })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })

  export const updateLead = asyncHandler(async (req, res) => {
    const leadExist = await Lead.findById(req.params.id)
  
    if (leadExist) {
        leadExist.name = req.body.name || leadExist.name
        leadExist.email = req.body.email.toLowerCase() || leadExist.email
  
      const updatedLead = await leadExist.save()
  
      res.json({
        _id: updatedLead._id,
        name: updatedLead.name,
        email: updatedLead.email,
      })
    } else {
      res.status(404)
      throw new Error('Lead not found')
    }
  })

  export const claimLead = asyncHandler(async (req, res) => {
    const claimLead = await Lead.findOneAndUpdate(
        { _id: req.params.id },
        { claimed: true, user: req.body.userId },
        { new: true }
      );
  
    if (claimLead) {
      res.json({ message: 'Lead claimed' })
    } else {
      res.status(404)
      throw new Error('There was an error, lead not claimed')
    }
  })
  
  export const returnLead = asyncHandler(async (req, res) => {
    const returnLead = await Lead.findOneAndUpdate(
        { _id: req.params.id },
        { returned: true },
        { new: true }
      );
  
    if (returnLead) {
      res.json({ message: 'Lead returned' })
    } else {
      res.status(404)
      throw new Error('There was an error, lead not returned')
    }
  })