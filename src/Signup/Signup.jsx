import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import img from '../images/489447.png'
export default function Signup() {
    let navto = useNavigate()
    const [user, setUser] = useState({
        full_name: "",
        user_name: "",
        password: ""
    })
    const [alr, setalr] = useState('none')

    let newobj = { ...user }
    //repeated each change
    const fill_data = (e, name) => {
        newobj[name] = e.target.value
        setUser(newobj)
    }
    const completeSubmition = async () => {
        //send request to backend 
        let response = await axios.post('http://localhost:5000/signup', user)
        if (response.data.message) {
            //hide error if still exist
            setalr('none')
            //navigate to camera screen 
            navto('/camera')
        } else {
            //show error 
            setalr('block')
        }
    }
    // navto('/camera')
    return (
        <div className='h-100 p-3 signUpScreen'>
            <div className=' h-100 d-flex flex-column form-div '>

                <div className='d-flex justify-content-center '><h1 className='text-dark display-1 fw-bold'>Sign up</h1></div>
                <div className='d-flex justify-content-center logo'><img src={img} className='w-50' alt="" /></div>

                <div className='p-3 rounded rounded-5 bg-login pt-5 text-center'>
                    <div className={`alert alert-danger form-control d-${alr}`}>user name already exist </div>
                    <input className='form-control my-3' placeholder='Name' onChange={(e) => { fill_data(e, 'full_name') }}></input>
                    <input className='form-control my-3' placeholder='User name' onChange={(e) => { fill_data(e, 'user_name') }}></input>
                    <input className='form-control my-3' placeholder='Password' onChange={(e) => { fill_data(e, 'password') }}></input>
                    <button className='form-control btn btn-success ' onClick={() => { completeSubmition() }} >Register</button>
                    <p className='text-dark mt-2'>Already have account? <a className='link-color' onClick={()=>{navto('/login')}}>Login</a></p>
                    <p>Continue as <a className='link-color' onClick={()=>{navto('/camera')}}>Guest </a></p>
                </div>
            </div>
        </div>
    )
}
