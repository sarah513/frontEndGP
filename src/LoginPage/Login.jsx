import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import img from '../images/blue.png'
export default function Login() {
    let navto = useNavigate()
    const [alr, setalr] = useState('none')
    const [user, setUser] = useState({
        user_name: "",
        password: ""
    })

    let newobj = { ...user }
    const fill_data = (e, name) => {
        console.log(e.target.value, name)
        newobj[name] = e.target.value
        setUser(newobj)
    }
    const log_in = async () => {
        let response = await axios.post('http://172.26.112.1:5000/login', user)
        if (response.data.message) {
            setalr('none')
            console.log(user)
            localStorage.setItem('username',user.user_name)
            navto('/camera')
        } else {
            setalr('block')
        }
    }
    return (
        <div className='h-100 p-3 signUpScreen'>
            <div className=' h-100 d-flex flex-column justify-content-center login-div-p'>

                <div className='d-flex justify-content-center '><img src={img} className='w-50 logo-p' alt="" /></div>

                <div className='p-3 rounded rounded-5 bg-login text-center'>
                    <div className='d-flex justify-content-center '><h1 className='text-dark display-1 fw-bold'>Login</h1></div>
                    <div className={`alert alert-danger form-control d-${alr} fs-6`}>invalid user name or password </div>
                    <input className='form-control my-3' placeholder='User name' onChange={(e) => { fill_data(e, 'user_name') }}></input>
                    <input className='form-control my-3' placeholder='Password' onChange={(e) => { fill_data(e, 'password') }}></input>
                    <button className='form-control btn btn-success ' onClick={() => { log_in() }}>Login</button>
                    <p className='text-dark mt-2'>don't have account? <a className='link-color' onClick={()=>{navto('/reg')}}>Create account</a></p>
                    <p>Continue as <a className='link-color' onClick={()=>{navto('/camera')}}>Guest </a></p>
                </div>
            </div>
        </div>
    )
}
