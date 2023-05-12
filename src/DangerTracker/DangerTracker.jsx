import { useState, useEffect } from 'react';
import axios from 'axios';
import { speak } from '../Sound/Sound.jsx';
import { debounce } from 'lodash';

function DangerTracker(props) {
    const [lastPosition, setLastPosition] = useState(0);
    const [lastTime,setLastTime]=useState(0);
    const [speed, setSpeed] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [acceleration, setAcceleration] = useState(0);
    let [warn, setwarn] = useState('light')
    let [warn2, setwarn2] = useState('light')
    let [warn3, setwarn3] = useState('light')
    const [temp, setTemp] = useState({
        city_name: "",
        temp: 0,
        description: ""
    })
    console.log(props)
    const API_KEY = '8f2e502b50c64f1caa277eecd6b32463';
    const debouncedFetchWeatherData = debounce((latitude, longitude) => {
        const API_LOCATION_URL = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&tz=local&key=${API_KEY}`
        axios.get(API_LOCATION_URL)
          .then(response => {
            let { data } = response
            let description = data.data[0].weather.description.toLowerCase()
            let isNotSuitable = description.includes('fog') || description.includes('haze')
            let d = data.data[0]
            let newTemp = { ...temp }
            newTemp['city_name'] = d.city_name
            newTemp['temp'] = d.temp
            newTemp['description'] = description
            setTemp(newTemp)
            console.log(data);
            console.log(description)
            console.log(isNotSuitable)
            // handle the weather data here
          })
          .catch(error => {
            console.error(error);
          });
      }, 5000); // debounce for 1 second (1000 milliseconds)
     
      function handlePositionUpdate(position) {
        let { latitude, longitude, timestamp } = position.coords;
        if (!timestamp) {
            timestamp = Date.now()
        }
        console.log({ latitude, longitude, timestamp })
        // debouncedFetchWeatherData(latitude, longitude);
        if (lastPosition) {
            const { latitude: lastLat, longitude: lastLng, timestamp: lastTimestamp, speed: lastSpeed } = lastPosition;
            console.log({ latitude: lastLat, longitude: lastLng, timestamp: lastTimestamp, speed: lastSpeed })
            const distance = calculateDistance(latitude, longitude, lastLat, lastLng);
            if (distance !== null) {
                const timeDelta = (timestamp - lastTimestamp) / 1000; // convert to seconds
                const speed = distance / timeDelta;
                if (isFinite(speed) && !isNaN(speed)) {
                    setSpeed(speed);
    
                    const direction = calculateDirection(latitude, longitude, lastLat, lastLng);
                    const velocity = speed * direction;
                    if (isFinite(velocity) && !isNaN(velocity)) {
                        setVelocity(velocity);
    
                        const acceleration = (speed - (lastSpeed || 0)) / timeDelta;
                        if (isFinite(acceleration) && !isNaN(acceleration)) {
                            setAcceleration(acceleration);
    
                            if (speed > 120) {
                                // alert('Danger: Excessive speed!');
                                // this.setWarn('danger');
                            }
    
                            if (Math.abs(velocity) > 50) {
                                // alert('Danger: Excessive velocity!');
                                // this.setWarn2('danger');
                            }
    
                            if (Math.abs(acceleration) > 5) {
                                // alert('Danger: Excessive acceleration!');
                                // this.setWarn3('danger');
                            }
                        }
                    }
                }
            }
        }
    
        setLastPosition({
            latitude,
            longitude,
            timestamp,
            speed,
        });
      }
    
      function handleError(error) {
        console.error(error);
      }
    useEffect(() => {
        let watchId;
        const intervalId = setInterval(() => {
            // Code block to be executed every 2 seconds
            console.log(1)
            navigator.geolocation.getCurrentPosition(handlePositionUpdate, handleError);

            // let brackingDis=calculateBrakingDistance(parseFloat(props.distance), speed)
            // warning(brackingDis)
          }, 2000);
      
          // Cleanup function to clear the interval when the component unmounts or the effect re-runs
          
        
        return () => clearInterval(intervalId);
    }, []);

    function calculateBrakingDistance(dis, speed) {
        let distance = dis - ((speed * speed) / 16)
        return distance
    }
    function warning(brakingdistance) {
        // howa mafrod zero bs 3amleen 7esab en el user mmkn ykon rd f3lu batee2 aw el net batee2 
        console.log(brakingdistance,props.name)
        if (brakingdistance <= 10) {
            console.log(brakingdistance,props.name)
            let text=`${props.name} is at less that 10 meters`
            speak(text)
        }
    }

    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // metres
        const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lng2 - lng1) * Math.PI) / 180;

        if (Δφ === 0 && Δλ === 0) {
            return 0;
        }

        if (!isFinite(R) || isNaN(R) || !isFinite(φ1) || isNaN(φ1) || !isFinite(φ2) || isNaN(φ2) || !isFinite(Δφ) || isNaN(Δφ) || !isFinite(Δλ) || isNaN(Δλ)) {
            return null;
        }

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        if (!isFinite(a) || isNaN(a)) {
            return null;
        }

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        if (!isFinite(c) || isNaN(c)) {
            return null;
        }

        return R * c;
    }

    function calculateDirection(lat1, lng1, lat2, lng2) {
        const x = Math.cos(lat2) * Math.sin(lng2 - lng1);
        const y = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

        const direction = Math.atan2(x, y);

        if (!isFinite(direction) || isNaN(direction)) {
            return 0;
        }

        return direction;
    }
    return (
        <div className='col-12 d-flex flex-column justify-content-between align-items-center dangers text-light'>
            <p className={`text-light text-${warn}`}>Speed: {speed && speed.toFixed(2)} m/s</p>
            <p className={`text-light text-${warn2}`}>Velocity:{velocity && velocity.toFixed(2)}m/s</p>
            <p className={`text-light text-${warn3}`}>Acceleration:{acceleration && acceleration.toFixed(2)}m/s²</p>
            <p className={`text-light`}>city:{temp.city_name}</p>
            <p className={`text-light`}>temperture:{temp.temp}</p>
            <p className={`text-light`}>state:{temp.description}</p>
        </div>
    );
}

export default DangerTracker;