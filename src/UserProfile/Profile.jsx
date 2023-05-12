import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export default function Profile() {
    const navto= useNavigate()
    const [user, setuser] = useState({
        full_name:"",
        user_name:"",
        allow_holes_bumps:true,
        allow_pedistrian:true,
        allow_share:true,
        allow_vehicle:true,
        close_friends:[]
    })

    let getData = async () => {
        const user=localStorage.getItem('username')
        let { data } = await axios.get('http://localhost:5000/data', {
            headers: {
                // ha5du men el local storage b3d kda 
                'user_name': user,
                'Content-Type': 'application/json'
            }
        })
        console.log(data)
        setuser(data.result)
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <div className='signUpScreen h-100 p-4'>
            <div>
                <p>name : {user.full_name}</p>
                <p>user name :{user.user_name}</p>
                <p>allow_holes_bumps :{`${user.allow_holes_bumps}`} </p>
                <p>allow_pedistrian : {`${user.allow_pedistrian}`}</p>
                <p>allow_share : {`${user.allow_share}`}</p>
                <p>allow_vehicle :{`${user.allow_vehicle}`}</p>
                <button className='btn btn-success'>add friend</button>
                <p>friends</p>
                {
                    user.close_friends.map((ele)=>{
                        return <p>{ele}</p>
                    })
                }
                <button className=' btn btn-success' onClick={()=>{navto('/set')}}>update</button>
            </div>
        </div>

    )
}
