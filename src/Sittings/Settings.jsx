import React ,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Settings() {
  let navto=useNavigate()
    const [checkedItems, setCheckedItems] = useState({'allow_holes_bumps':true,'allow_vehicle':true,'allow_pedistrian':true,'allow_share':true}); // Initialize state as an empty object of checked items
    // allow_holes_bumps,allow_vehicle,allow_pedistrian,allow_share
  const items = [
    { id: 'allow_holes_bumps', value: "allow_holes_bumps" },
    { id: 'allow_vehicle', value: "allow_vehicle" },
    { id: 'allow_pedistrian', value: 'allow_pedistrian' },
    { id: 'allow_share', value: 'allow_share' },
  ];

  let newobj={...checkedItems}
  const handleChange = (event) => {
    // update the state with the new checked item
    console.log(event.target.checked)
    newobj[event.target.name]=event.target.checked
    setCheckedItems(newobj);
    console.log(newobj)
    console.log(checkedItems)
  };
  const getselections=async()=>{
    let user=localStorage.getItem('username')

    if(user){
    let { data } = await axios.get('http://localhost:5000/data', {
            headers: {
                // ha5du men el local storage b3d kda 
                'user_name': user,
                'Content-Type': 'application/json'
            }
        })
        const {allow_holes_bumps,allow_pedistrian,allow_share,allow_vehicle}=data.result
        console.log({allow_holes_bumps,allow_pedistrian,allow_share,allow_vehicle})
        setCheckedItems({allow_holes_bumps,allow_pedistrian,allow_share,allow_vehicle})
      }
        else{
          
      setCheckedItems({allow_holes_bumps:true,allow_pedistrian:true,allow_vehicle:true,allow_share:false})
      console.log(checkedItems)
        }
  }
  useEffect(()=>{
    getselections()
  },[])
  const setSelection=async ()=>{
    let user=localStorage.getItem('username')
    console.log(user)
    console.log(checkedItems)
    if(user){
      
    let response= await axios.patch('http://localhost:5000/setting',checkedItems, {
        headers: {
            // ha5du men el local storage b3d kda 
          'user_name': user,
          'Content-Type': 'application/json'
        }    
      })
      console.log(response)
    }else{

      }
      navto('/camera')

  }

  return (
    <div className='d-flex flex-column signUpScreen h-100 p-4'>
      <div className='text-dark fs-1'>Settings</div>
      {items.map(item => (
        <label key={item.id}className='my-2'>
          <input
          
            type="checkbox"
            name={item.id}
            value={item.value}
            checked={checkedItems[item.id] || false}
            onChange={handleChange}
          />
          {item.value}
        </label>
      ))}
      <button className='btn btn-success' onClick={()=>{setSelection()}}>Save</button>
    </div>
  );
}


