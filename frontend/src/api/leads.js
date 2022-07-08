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

export const createLead = async (lead) => {
  try {
    const { data } = await axios.post(
      `http://localhost:4000/api/leads`,
      lead,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getLeads = async (page) => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/leads?page=${page}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateLead = async (lead) => {
  try {
    const { data } = await axios.put(
      `http://localhost:4000/api/leads/${lead._id}`,
      lead,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteLead = async (id) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:4000/api/leads/${id}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const claimLead = async (lead) => {
  try {
    const { data } = await axios.patch(
      `http://localhost:4000/api/leads/claim/${lead._id}`,
      lead,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const returnLead = async (lead) => {
  try {
    const { data } = await axios.patch(
      `http://localhost:4000/api/leads/return/${lead._id}`,
      lead,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}