import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
export default function Chat() {
    const [care, setcare] = useState('none')
    const [img, setimg] = useState('')
    const [date, setdate] = useState('')
    let { user_name } = useParams()

    const getimg = async () => {
        let sender = localStorage.getItem('username')
        let response = await axios.post("http://localhost:5000/care", { sender, driver: user_name })
        console.log(response.data.result)
        const timestamp =response.data.result.updatedAt ;
        const date = new Date(timestamp);
        const readableDate = date.toLocaleString();
        console.log('Human-readable date:', readableDate);
        setcare('block')
        setdate(readableDate)
        setimg(response.data.result.last_img)

    }
    console.log(user_name)
    return (
        <div className='signUpScreen h-100 p-4'>
            <div>
                <span className='fw-bold'>{user_name}</span>
            </div>
            <div className={`pt-3 d-${care}`}>
                <span className={`bg-info p-2 rounded rounded-4`}>
                    Are You Okay ?
                </span>
            </div>
            {img ?
                <div className={`w-100 p-4 d-flex justify-content-end d-${care}`}>
                    <div className='bg-success rounded rounded-4 w-100'>
                        <img src={img} className='w-100' alt="" />
                        <span className='p-3 text-light'>{date}</span>
                    </div>
                </div> : <></>}
            <div className='position-absolute bottom-0 py-5'>
                <button className='btn btn-info' onClick={() => { getimg() }}>Are You Okay?</button>
            </div>
        </div>
    )
}
