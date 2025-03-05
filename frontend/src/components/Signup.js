// import React, { useState } from 'react'
import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
// import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const Signup = (props) => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    cpassword: '',
    name: '',
    email: ''
  })
  // const hostLink = 'http://localhost:8000'
  // const hostLink = 'https://inotebook-backend-opal.vercel.app'
  const hostLink = process.env.REACT_APP_HOSTLINK
  const location = useLocation()


  useEffect(() => {
    // Check if the token is already in localStorage
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      console.log('Token already stored in localStorage:', storedToken)
      navigate('/') // Redirect to home page
      return // Exit earl y
    }

    // Extract the token from the URL
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    console.log('Query String:', location.search) // Debugging
    console.log('Token:', token) // Debugging

    if (token) {
      // Set the token in local storage
      localStorage.setItem('token', token)
      console.log('Token stored in localStorage:', localStorage.getItem('token')) // Debugging

      // Clear the token from the URL to prevent duplicate processing
      const cleanUrl = window.location.origin + window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)

      // Redirect to the desired page
      navigate('/')
    } else {
      console.log('No token found')
    }
  }, [location.search, navigate]) // Only depend on location.search and navigate

  const logInWithGoogle = () => {
    window.open(`${hostLink}/auth/google`, '_self')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, username, email, password } = credentials
    const response = await fetch(`${hostLink}/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, username, email, password })
    })
    const json = await response.json()
    // console.log(json);
    if (json.success) {
      localStorage.setItem('token', json.authtoken)
      navigate('/login')
      props.showAlert('New Account Created Successfully !', '#D4EDDA')
    } else {
      props.showAlert('username or email already exists !', '#F8D7DA')
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <>
      {' '}
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full mt-24 sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
            Sign Up to new account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-2' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 text-white'
              >
                Name
              </label>
              <div className='mt-2'>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='email'
                  required
                  value={credentials.name}
                  placeholder='Enter your Name here'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-white'
              >
                Username
              </label>
              <div className='mt-2'>
                <input
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='email'
                  required
                  value={credentials.username}
                  placeholder='Enter your username here'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-white'
              >
                Email
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={credentials.email}
                  placeholder='Enter your Email here'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Password
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required minLength={5}
                  value={credentials.password}
                  placeholder='Enter your password here'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Confirm Password
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='cpassword'
                  name='cpassword'
                  type='password'
                  autoComplete='current-password'
                  required minLength={5}
                  value={credentials.cpassword}
                  placeholder='Enter your password here'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* GOOGLE SIGNIN */}
          <button className='mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' onClick={() => logInWithGoogle()}>Sign Up with Google 🚀</button>

          <p className='mt-10 text-center text-sm text-gray-500'>
            Already have a account?{' '}
            <Link
              to='/login'
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
            >
              Signin
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Signup
