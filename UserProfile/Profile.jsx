import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export default function Profile() {
    const navto = useNavigate()
    const [newfriend, addfriend] = useState('');
    const [user, setuser] = useState({
        full_name: "",
        user_name: "",
        allow_holes_bumps: true,
        allow_pedistrian: true,
        allow_share: true,
        allow_vehicle: true,
        close_friends: []
    })

    let getData = async () => {
        const user = localStorage.getItem('username')
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

    let addnewfriend = async () => {
        let user_name = localStorage.getItem('username')
        let response = axios.patch("http://localhost:5000/addfriend", { friend_username: newfriend }, {
            headers: {
                user_name
            }
        })
        console.log((await response).data)
    }
    let input;
    let fillfriend = (e) => {
        input = e.target.value
        addfriend(input)
    }
    let dlt = async (e) => {
        let user_name = localStorage.getItem("username")
        let friend_username = e.target.id
        let response =await axios.patch("http://localhost:5000/dltfriend", {}, {
            headers: {
                user_name,
                friend_username
            }
        })
        console.log(response)
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
                <input type='text' className='form-control mb-3' placeholder='user name ...' onChange={(e) => { fillfriend(e) }} />
                <button className='btn btn-success' onClick={() => { addnewfriend() }}>add new friend</button>
                <p className='fw-bold mt-3'>Friends</p>
                {
                    user.close_friends.map((ele) => {
                        return (<div className='d-flex justify-content-between'>
                            <p >{ele}</p>
                            <div>
                                <button className=' btn btn-info me-3' onClick={() => { navto(`/chat/${ele}`) }}>Chat</button>
                                <button className='btn btn-danger' id={`${ele}`} onClick={(e) => { dlt(e) }}>delete Friend</button></div>
                        </div>)
                    })
                }
                <button className=' btn btn-success' onClick={() => { navto('/set') }}>update</button>
            </div>
        </div>

    )
}
