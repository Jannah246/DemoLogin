import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '../../helper/convert';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

import avatar from '../../assets/profile.png';
import styles from '../../styles/Username.module.css';
import { useDispatch } from 'react-redux';
import { setAdminUsername } from '../../state/auth/adminSlice';

const AdminLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const formik = useFormik({
      initialValues : {
        username: '',
        password : ''
      },
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async values => {
        dispatch(setAdminUsername(values.username));
      }
    })
  
    return (
      <div className="container mx-auto">
  
        <Toaster position='top-right' reverseOrder={false}></Toaster>
  
        <div className='flex justify-center items-center h-screen'>
          <div className={styles.glass} style={{ width: "50%", paddingTop: '2em'}}>
  
          <div className="title flex flex-col items-center">
              <h5 className='text-3xl font-bold'>Admin Login</h5>
              <span className='py-1 text-md w-2/3 text-center text-gray-500'>
                Hello admin.. Welcome back!!
              </span>
            </div>
  
            <form className='py-1' onSubmit={formik.handleSubmit}>
                <div className='profile flex justify-center py-3'>
                    <label htmlFor="profile">
                      <img src={avatar} className={styles.profile_img} alt="avatar" />
                    </label>
                </div>
  
                <div className="textbox flex flex-col items-center gap-3">
                    <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
                    <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='Password*' />
                    <button className={styles.btn} type='submit'>Go to console</button>
                </div>
  
            </form>
  
          </div>
        </div>
      </div>
    )
}

export default AdminLogin