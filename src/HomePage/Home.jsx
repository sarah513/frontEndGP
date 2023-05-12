import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Home() {
    let navto= useNavigate()
  return (
    <div className='container'>
        <div className='p-5'>
            <div className='d-flex flex-column'>
                <button className='btn btn-success my-2' onClick={()=>{navto('/login')}}>Login</button>
                <button className='btn btn-success my-2' onClick={()=>{navto('/reg')}}>Register</button>
                <button className='btn btn-success my-2' onClick={()=>{navto('/camera')}}>Guest</button>
            </div>
        </div>
    </div>
  )
}
