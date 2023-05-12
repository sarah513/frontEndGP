import React from 'react'

export default function Loading() {
    return (
        <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
            <div>
                <div className="loader"></div>;
                <p className='text-light '>Please wait </p>
            </div>
        </div>
    )
}
