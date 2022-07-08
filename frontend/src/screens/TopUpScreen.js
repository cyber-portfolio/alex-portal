import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
  FaClipboardList,
  FaChevronCircleDown,
  FaRedo,
} from 'react-icons/fa'
import Pagination from '../components/Pagination'
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/orders'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { UnlockAccess } from '../components/UnlockAccess'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const TopUpScreen = () => {
    const [page, setPage] = useState(1)
    const [details, setDetails] = useState('')
    const [order, setOrder] = useState('')
    const [displayQR, setDisplayQR] = useState(false)
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors },
    } = useForm({
      defaultValues: {},
    })
  
    const queryClient = useQueryClient()
  
    const { data, isLoading, isError, error } = useQuery(
      'leads',
      () => getOrders(page),
      {
        retry: 0,
      }
    )
  
    const {
      isLoading: isLoadingGetOrder,
      isError: isErrorGetOrder,
      error: errorGetOrder,
      isSuccess: isSuccessGetOrder,
      mutateAsync: getOrderMutateAsync,
    } = useMutation(['getOrders'], getOrders, {
      retry: 0,
      onSuccess: () => {
        reset()
        queryClient.invalidateQueries(['orders'])
      },
    })
  
    const {
      isLoading: isLoadingCreateOrder,
      isError: isErrorCreateOrder,
      error: errorCreateOrder,
      isSuccess: isSuccessCreateOrder,
      mutateAsync: createOrderMutateAsync,
    } = useMutation(['createOrder'], createOrder, {
      retry: 0,
      onSuccess: () => {
        reset()
        queryClient.invalidateQueries(['orders'])
      },
    })
  
    const {
      isLoading: isLoadingUpdateOrder,
      isError: isErrorUpdateOrder,
      error: errorUpdateOrder,
      isSuccess: isSuccessUpdateOrder,
      mutateAsync: updateOrderMutateAsync,
    } = useMutation(['updateOrder'], updateOrder, {
      retry: 0,
      onSuccess: () => {
        reset()
        queryClient.invalidateQueries(['orders'])
      },
    })

    const {
      isLoading: isLoadingDeleteOrder,
      isError: isErrorDeleteOrder,
      error: errorDeleteOrder,
      isSuccess: isSuccessDeleteOrder,
      mutateAsync: deleteOrderMutateAsync,
    } = useMutation(['deleteOrder'], deleteOrder, {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['orders']),
    })

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const submitHandler = (data) => {
        !edit
        ? createOrderMutateAsync({
            credits: data.credits,
            crypto_sign:'BTC',
            email: 'wizcomputer02@gmail.com',
            amount_paid: data.credits,
            userId: userInfo
          }).then((results) => setOrder(results))
        : updateOrderMutateAsync({
            _id: id,
            credits: data.credits,
            userId: userInfo
        })
      }

    const [id, setId] = useState(null)
    const [edit, setEdit] = useState(false)

    const formCleanHandler = () => {
    setEdit(false)
    reset()
    }

    const deleteHandler = (id) => {
      confirmAlert(Confirm(() => deleteOrderMutateAsync(id)))
    }

    const editHandler = (order) => {
    setId(order._id)
    setEdit(true)
    setValue('credits', order.credits)
    }

    const detailsHandler = (order) => {
    setDetails(order)
    }

    useEffect(() => {
    const refetch = async () => {
        await queryClient.prefetchQuery('leads')
    }
    refetch()
    }, [page, queryClient])

    return (
        <div className='container'>
            {isSuccessGetOrder && (
                <Message variant='success'>Order has been displayed successfully.</Message>
            )}
            {isErrorGetOrder && (
                <Message variant='danger'>{errorGetOrder}</Message>
            )}
            {isSuccessCreateOrder && (
                <Message variant='success'>Order has been created successfully.</Message>
            )}
            {isErrorCreateOrder && (
                <Message variant='danger'>{errorCreateOrder}</Message>
            )}

            <div style={{textAlign: 'center'}}>
                <h1>Top up Dashboard</h1>
            </div>

            <div
                className='modal fade'
                id='detailsModal'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                tabIndex='-1'
                aria-labelledby='detailsModalLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog'>
                <div className='modal-content modal-background'>
                    <div className='modal-header'>
                    <h3 className='modal-title ' id='detailsModalLabel'>
                        Order Details
                    </h3>
                    <button
                        type='button'
                        className='btn-close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                        onClick={formCleanHandler}
                    ></button>
                    </div>
                    <div className='modal-body'>
                    <p>Order ID : {details._id}</p>
                    <p>Credits Purchased : {details.credits}</p>
                    <p>Timestamp : {details.createdAt}</p>
                    <p>Instrucitons to purchase {details["credits"]} credits, send your payment:</p>
                        <p>Send exactly : {details["amount"]} to 
                        {details.crypto} Address : {details.address}</p>
                        <br></br>
                        <img src={details.qrcode_url} />
                    </div>
                </div>
                </div>
            </div>

            <button
            className='btn btn-primary '
            data-bs-toggle='modal'
            data-bs-target='#createOrderModal'
            style={{margin: 'auto', display:'block'}}
            >
            <FaPlus className='mb-1' /> Top up now!
            </button>

            <div
                className='modal fade'
                id='createOrderModal'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                tabIndex='-1'
                aria-labelledby='editUserModalLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog'>
                <div className='modal-content modal-background'>
                    <div className='modal-header'>
                    <h3 className='modal-title ' id='editUserModalLabel'>
                        {edit ? 'Edit Purchased Credits' : 'Purchase more credits'}
                    </h3>
                    <button
                        type='button'
                        className='btn-close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                        onClick={formCleanHandler}
                    ></button>
                    </div>
                    <div className='modal-body'>
                    {isLoading ? (
                        <div className='text-center'>
                        <Loader
                            type='ThreeDots'
                            color='#00BFFF'
                            height={100}
                            width={100}
                            timeout={3000} //3 secs
                        />
                        </div>
                    ) : isError ? (
                        <Message variant='danger'>{error}</Message>
                    ) : (
                        <form onSubmit={handleSubmit(submitHandler)}>
                            
                    {order &&
                    <>
                        <p>Instrucitons to purchase {order.credits} credits, send your payment:</p>
                        <p>Send exactly : {order.amount} to 
                        {order.crypto} Address : {order.address}</p>
                        <br></br>
                        <img src={order.qrcode_url} />
                    </>
                    }
                      {  !order &&
                      <div className='mb-3'>
                            <label htmlFor='credits'>Amount of credits you want to buy:</label>
                            <input
                            {...register('credits', { required: 'Amount is required' })}
                            type='number'
                            placeholder='Enter amount'
                            className='form-control'
                            autoFocus
                            />
                            {errors.name && (
                            <span className='text-danger'>{errors.name.message}</span>
                            )}
                        </div>}

                        <div className='modal-footer'>
                            {order &&
                            <Link to={{pathname:order.status_url}} target={"_blank"}>
                                <button
                                type='button'
                                className='btn btn-secondary '
                                >
                                Payment status
                                </button>
                            </Link>}
                            <button
                            type='button'
                            className='btn btn-secondary '
                            data-bs-dismiss='modal'
                            onClick={formCleanHandler}
                            >
                            Close
                            </button>
                            {!order &&
                            <button
                            type='submit'
                            className='btn btn-primary '
                            disabled={isLoadingCreateOrder}
                            >
                            {isLoadingCreateOrder ? (
                                <span className='spinner-border spinner-border-sm' />
                            ) : (
                                'Submit'
                            )}
                            </button>}
                        </div>
                        </form>
                    )}
                    </div>
                </div>
                </div>
            </div>


            {isLoading ? (
                <div className='text-center'>
                <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
                </div>
            ) : isError ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                <div className='table-responsive '>
                {order &&
                    <>
                    <div style={{margin: 'auto', textAlign: 'center', backgroundColor:'gainsboro', padding: 20, margin: 10}}>
                        <h2>Recently purchased credits</h2>
                        <p>Instrucitons to purchase {order.credits} credits, send your payment:</p>
                        <p>Send exactly : {order.amount} to 
                        {order.crypto} Address : {order.address}</p>
                        <br></br>
                        <button onClick={() => displayQR ? setDisplayQR(false) : setDisplayQR(true)}>{displayQR ?<span>Hide QR</span>:<span>Display QR</span>}</button>
                        <br></br>
                        {displayQR && <img src={order.qrcode_url} />}

                    </div>
                    </>
                    }
                    <div style={{textAlign: 'center', backgroundColor: 'white', padding: 10, marginTop: 10}}>
                        <h3>Top up history</h3>
                    </div>
                    <table className='table table-sm hover bordered striped caption-top '>
                    <caption>{data && data.total} records were found</caption>
                    <thead>
                        <tr>
                        <th>PAYMENT STATUS</th>
                        <th>CREDITS</th>
                        <th>CRYPTO</th>
                        <th>TIMESTAMP</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                        data.data.map((user) => (
                            user.user === userInfo._id &&
                            <tr key={user._id}>
                            <td>{user.paymnet_status}</td>
                            <td>{user.credits}</td>
                            <td>{user.crypto}</td>
                            <td>{user.createdAt}</td>
                            <td className='btn-group'>
                                {userInfo.isAdmin &&
                                <>
                                <button
                                className='btn btn-primary btn-sm'
                                onClick={() => editHandler(user)}
                                data-bs-toggle='modal'
                                data-bs-target='#createOrderModal'
                                style={{margin:'1px'}}
                                >
                                <FaEdit className='mb-1' /> Edit
                                </button>

                                <button
                                className='btn btn-danger btn-sm'
                                onClick={() => deleteHandler(user._id)}
                                disabled={isLoadingDeleteOrder}
                                style={{margin:'1px'}}
                                >
                                {isLoadingDeleteOrder ? (
                                    <span className='spinner-border spinner-border-sm' />
                                ) : (
                                    <span>
                                    {' '}
                                    <FaTrash className='mb-1' /> Delete
                                    </span>
                                )}
                                </button>
                                </>}
                                <button
                                    className='btn btn-primary btn-sm'
                                    onClick={() => detailsHandler(user)}
                                    data-bs-toggle='modal'
                                    data-bs-target='#detailsModal'
                                    style={{margin:'1px'}}
                                >
                                    <span>
                                    {' '}
                                    <FaClipboardList className='mb-1' /> Details
                                    </span>
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </>
            )}
        </div>
    )
}
export default TopUpScreen