import React, { useState, useEffect } from 'react'
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
import { getUsers, updateUser, deleteUser, createUser, userClaimLead, userReturnLead } from '../api/users'
import { getLeads, updateLead, deleteLead, createLead, claimLead, returnLead } from '../api/leads'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { UnlockAccess } from '../components/UnlockAccess'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const MyLeadListScreen = () => {
  const [page, setPage] = useState(1)
  const [details, setDetails] = useState('')
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
    () => getLeads(page),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateUser,
    isError: isErrorUpdateUser,
    error: errorUpdateUser,
    isSuccess: isSuccessUpdateUser,
    mutateAsync: updateUserMutateAsync,
  } = useMutation(['updateLead'], updateLead, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['leads'])
    },
  })

  const {
    isLoading: isLoadingDeleteUser,
    isError: isErrorDeleteUser,
    error: errorDeleteUser,
    isSuccess: isSuccessDeleteUser,
    mutateAsync: deleteUserMutateAsync,
  } = useMutation(['deleteLead'], deleteLead, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['leads']),
  })

  const {
    isLoading: isLoadingCreateUser,
    isError: isErrorCreateUser,
    error: errorCreateUser,
    isSuccess: isSuccessCreateUser,
    mutateAsync: createUserMutateAsync,
  } = useMutation(['createLead'], createLead, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['leads'])
    },
  })

  const {
    isLoading: isLoadingUserClaimLead,
    isError: isErrorUserClaimLead,
    error: errorUserClaimLead,
    isSuccess: isSuccessUserClaimLead,
    mutateAsync: userClaimLeadMutateAsync,
  } = useMutation(['userClaimLead'], userClaimLead, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['users'])
    },
  })

  const {
    isLoading: isLoadingClaimLead,
    isError: isErrorClaimLead,
    error: errorClaimLead,
    isSuccess: isSuccessClaimLead,
    mutateAsync: claimLeadMutateAsync,
  } = useMutation(['claimLead'], claimLead, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['leads'])
    },
  })

  const {
    isLoading: isLoadingUserReturnLead,
    isError: isErrorUserReturnLead,
    error: errorUserReturnLead,
    isSuccess: isSuccessUserReturnLead,
    mutateAsync: userReturnLeadMutateAsync,
  } = useMutation(['userReturnLead'], userReturnLead, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['users'])
    },
  })

  const {
    isLoading: isLoadingReturnLead,
    isError: isErrorReturnLead,
    error: errorReturnLead,
    isSuccess: isSuccessReturLead,
    mutateAsync: returnLeadMutateAsync,
  } = useMutation(['returnLead'], returnLead, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['leads'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteUserMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateUserMutateAsync({
          _id: id,
          name: data.name,
          email: data.email,
          password: data.password,
          group: data.group,
        })
      : createUserMutateAsync(data)
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const claimLeadHandler = (lead) => {
    userClaimLeadMutateAsync({
      _id: lead._id,
      userId: userInfo._id,
      credits: lead.credits,
    })
    .then(() => {
      claimLeadMutateAsync({
        _id: lead._id,
        userId: userInfo._id,
      })
    })
    .catch((err) => console.log('error claiming lead LeadListScreen '+err))
  }

  const returnLeadHandler = (lead) => {
    userReturnLeadMutateAsync({
      _id: lead._id,
      userId: lead.user,
      credits: lead.credits,
    })
    .then(() => {
      returnLeadMutateAsync({
        _id: lead._id,
      })
    })
    .catch((err) => console.log('error returning lead LeadListScreen '+err))
  }

  const editHandler = (user) => {
    console.log(user)
    setId(user._id)
    setEdit(true)
    setValue('name', user.name)
    setValue('email', user.email)
    setValue('group', user.group)
  }

  const detailsHandler = (user) => {
    setDetails(user)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('leads')
    }
    refetch()
  }, [page, queryClient])

  return (
    <div className='container'>
      {isSuccessDeleteUser && (
        <Message variant='success'>Lead has been deleted successfully.</Message>
      )}
      {isErrorDeleteUser && (
        <Message variant='danger'>{errorDeleteUser}</Message>
      )}
      {isSuccessUpdateUser && (
        <Message variant='success'>Lead has been updated successfully.</Message>
      )}
      {isErrorUpdateUser && (
        <Message variant='danger'>{errorUpdateUser}</Message>
      )}
      {isSuccessCreateUser && (
        <Message variant='success'>Lead has been Created successfully.</Message>
      )}
      {isErrorCreateUser && (
        <Message variant='danger'>{errorCreateUser}</Message>
      )}
      {isSuccessClaimLead && (
        <Message variant='success'>Lead has been Claimed successfully.</Message>
      )}
      {isErrorClaimLead && (
        <Message variant='danger'>{errorClaimLead}</Message>
      )}
      {isSuccessUserClaimLead && (
        <Message variant='success'>User has Claimed Lead successfully.</Message>
      )}
      {isErrorUserClaimLead && (
        <Message variant='danger'>{errorUserClaimLead}</Message>
      )}
      {isSuccessUserReturnLead && (
        <Message variant='success'>User has Returned Lead successfully.</Message>
      )}
      {isErrorUserReturnLead && (
        <Message variant='danger'>{errorUserReturnLead}</Message>
      )}
      {isSuccessReturLead && (
        <Message variant='success'>Returned Lead successfully.</Message>
      )}
      {isErrorReturnLead && (
        <Message variant='danger'>{errorReturnLead}</Message>
      )}

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
                Lead Details
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
            <p>Name : {details.name}</p>
              <p>Email : {details.email}</p>
              <p>Phone : {details.phone}</p>
              <p>Description : {details.description}</p>
              <p>Skills : {details.skills}</p>
              <p>Date aggregated: {details.date}</p>
              <p>Appointment Details: <br />
              Date: {details.dateAppt} <br />
              Time: {details.time} <br />
              Timezone : {details.timezone}</p>
              <p>Budget : {details.budget}</p>
              <p>Where did this lead come from : {details.leadfunnel}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className='modal fade'
        id='editUserModal'
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
                {edit ? 'Edit Lead' : 'Add Lead'}
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
                  <div className='mb-3'>
                    <label htmlFor='name'>Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.name && (
                      <span className='text-danger'>{errors.name.message}</span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='email'>Email Address</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.+\S+/,
                          message: 'Entered value does not match email format',
                        },
                      })}
                      type='email'
                      placeholder='Enter email'
                      className='form-control'
                    />
                    {errors.email && (
                      <span className='text-danger'>
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingCreateUser || isLoadingUpdateUser}
                    >
                      {isLoadingCreateUser || isLoadingUpdateUser ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        {userInfo.isAdmin &&
          <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editUserModal'
        >
          <FaPlus className='mb-1' />
        </button>}
        <h3 className=''>Your Lead Dashboard</h3>
        <Pagination data={data} setPage={setPage} />
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
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>CREDITS</th>
                  <th>DESCRIPTION</th>
                  <th>SKILLS</th>
                  <th>TYPE</th>
                  <th>BUDGET</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((user) => (
                    user.user === userInfo._id &&
                    <tr key={user._id}>
                      <td>{user.claimed && <span style={{backgroundColor:'lightgreen', padding: 5}}>Claimed</span>} {user.returned && <span style={{backgroundColor:'darkred', padding: 5, color:'white'}}>Returned</span>}</td>
                      <td>{user.credits}</td>
                      <td>{user.description}</td>
                      <td>{user.skills}</td>
                      <td>{user.type}</td>
                      <td>{user.budget}</td>
                      <td className='btn-group'>
                        {userInfo.isAdmin &&
                        <>
                          <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(user)}
                          data-bs-toggle='modal'
                          data-bs-target='#editUserModal'
                          style={{margin:'1px'}}
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(user._id)}
                          disabled={isLoadingDeleteUser}
                          style={{margin:'1px'}}
                        >
                          {isLoadingDeleteUser ? (
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
                        {userInfo.isAdmin &&
                        <>
                        <button
                            className='btn btn-primary btn-sm'
                            onClick={() => claimLeadHandler(user)}
                            style={{margin:'1px'}}
                        >
                            <span>
                              {' '}
                              <FaChevronCircleDown className='mb-1' /> Claim lead
                            </span>
                        </button>
                          <button
                            className='btn btn-primary btn-sm'
                            onClick={() => returnLeadHandler(user)}
                            style={{margin:'1px'}}
                        >
                            <span>
                              {' '}
                              <FaRedo className='mb-1' /> Return lead
                            </span>
                        </button>
                        </>}
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

export default MyLeadListScreen