 import { useEffect, useState } from 'react'
import { getLeads } from '../api/leads'
 //import { useQuery } from 'react-query'
 import { Navigate  } from 'react-router-dom'

const HomeScreen = () => {
   //const { data, isLoading } = useQuery('users', getLeads, { retry: 0 })
   //console.log(!isLoading && data)
   const [redirect, setRedirect] = useState(false)

   useEffect(() => {
    setTimeout(() => { 
      setRedirect(true);
    }, 1000)
   }, [])
   

  return (
    <div className='text-center'>
      <h1>Wordpress, web development, and freelance leads</h1>
      <h3>Available leads:</h3>
      {redirect ?
      <Navigate  to='/leads' />
      :
      <>
      <span className='spinner-grow mt-5' /> <br />
      Searching for leads...
      </>
      }
    </div>
  )
}

export default HomeScreen
