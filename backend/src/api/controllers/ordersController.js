import Order from "../models/orderModel.js";
import asyncHandler from 'express-async-handler'

import CoinPayments from 'coinpayments'

const client = new CoinPayments({
    key: process.env.KEY,
    secret: process.env.SECRET
  });

export const createOrder = asyncHandler(async (req, res) => {
    const { credits, userId, email, crypto_sign, amount_paid  } = req.body

    //Create transaction
    client.createTransaction({'currency1' : "USD", 'currency2' : crypto_sign, 'amount' : amount_paid, 'buyer_email': email},function(err,result){
      console.log("result "+JSON.stringify(result)+" err "+err);
      //console.log(req.body.email);
      sendOrder(result)
    })

    const sendOrder = async (result) => {
  
      const orderCreate = await Order.create({
        credits,
        user: userId,
        address: result.address,
        status_url: result.status_url,
        qrcode_url: result.qrcode_url,
        amount: result.amount,
        crypto: crypto_sign,
        txn_id: result.txn_id,
      })

      if (orderCreate) {
        res.status(201).json({
          _id: orderCreate._id,
          credits: orderCreate.credits,
          address: orderCreate.address,
          status_url: orderCreate.status_url,
          qrcode_url: orderCreate.qrcode_url,
          amount: orderCreate.amount,
          crypto: orderCreate.crypto,
          txn_id: orderCreate.txn_id,
        })
      } else {
        res.status(400)
        throw new Error('Invalid order data')
      }

    }
    
  })

export const getOrder = asyncHandler(async (req, res) => {
    const _id = req.params.id
    const order = await Order.findById(_id)
    if (order) {
      res.json({
        _id: order._id,
        credits: order.credits,
        user: order.user,
      })
    } else {
      res.status(404)
      throw new Error('There are no orders to match')
    }
  })

  export const getOrders = asyncHandler(async (req, res) => {
    let query = Order.find()
  
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 50
    const skip = (page - 1) * pageSize
    const total = await Order.countDocuments()
  
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

  export const deleteOrder = asyncHandler(async (req, res) => {
    const user = await Order.findById(req.params.id)
  
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

  export const updateOrder = asyncHandler(async (req, res) => {
    const orderExist = await Order.findById(req.params.id)
  
    if (orderExist) {
        orderExist.credits = req.body.credits || orderExist.credits
        orderExist.user = req.body.user || orderExist.user
  
      const updatedOrder = await orderExist.save()
  
      res.json({
        _id: updatedOrder._id,
        credits: updatedOrder.credits,
        user: updatedOrder.user,
      })
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })
