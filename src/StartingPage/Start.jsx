import React from 'react'
import myloading from '../images/88044-car-safety-edit.gif'
import { useRef } from 'react';
export default function Start() {
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
  };

  const handlePause = () => {
    videoRef.current.pause();
  };

  return (
    <div className='startPage h-100 d-flex flex-column justify-content-center text-center'>
     <img src={myloading}  className="w-100"  alt="" />
     <p className=' fs-3'>Stay secure on the go.</p>
    </div>
  );
}
