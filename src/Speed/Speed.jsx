import React, { useEffect, useState } from 'react'

export default function Speed() {
    const GRAVITY = 9.81; // m/s^2
    const SAMPLE_INTERVAL = 50; // milliseconds
    const [speed, setSpeed] = useState(0);
    useEffect(() => {
        let lastTimestamp = null;
        let lastPosition = null;

        const handleMotion = (event) => {
            const { accelerationIncludingGravity, timestamp } = event;
            console.log({ accelerationIncludingGravity, timestamp })
            const { x, y, z } = accelerationIncludingGravity;

            // Calculate the total acceleration
            const acceleration = Math.sqrt(x ** 2 + y ** 2 + (z - GRAVITY) ** 2);

            // Calculate the time elapsed since the last sample
            const deltaT = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0;

            // Calculate the distance traveled since the last sample
            const distance = lastPosition
                ? acceleration * (deltaT ** 2) / 2 + speed * deltaT
                : 0;

            // Calculate the speed based on the distance traveled
            const newSpeed = distance / deltaT;

            // Update the state with the new speed
            setSpeed(newSpeed);

            // Update the last timestamp and position
            lastTimestamp = timestamp;
            lastPosition = acceleration;

            console.log('Acceleration:', acceleration);
            console.log('Delta T:', deltaT);
            console.log('Distance:', distance);
            console.log('New speed:', newSpeed);
        };

        // Register the event listener
        window.addEventListener('devicemotion', handleMotion);

        // Clean up the event listener
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    return (

        <div>
            {console.log(speed)}
            <p className='text-light'>Speed: {speed.toFixed(2)} m/s</p>
        </div>
    )
}
