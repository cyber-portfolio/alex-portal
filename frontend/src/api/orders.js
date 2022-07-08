import axios from 'axios'

const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        localStorage.getItem('userInfo') &&
        JSON.parse(localStorage.getItem('userInfo')).token
      }`,
    },
  }
}

export const createOrder = async (order) => {
  try {
    const { data } = await axios.post(
      `http://localhost:4000/api/orders`,
      order,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getOrders = async (page) => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/orders?page=${page}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateOrder = async (order) => {
  try {
    const { data } = await axios.patch(
      `http://localhost:4000/api/orders/${order._id}`,
      order,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteOrder = async (id) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:4000/api/orders/${id}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}