import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading';
import Path from '../Path/Path';
import Speed from '../Speed/Speed';
import account from '../images/icons8-male-user-50.png'
import settings from '../images/icons8-settings-50.png'
import { speak } from '../Sound/Sound.jsx';
import { debounce } from 'lodash';
// import DangerTracker from '../DangerTracker/DangerTracker';
const Camera = () => {
  let navto = useNavigate()
  let video = document.getElementById('video');
  let canvas = document.getElementById('canvas');
  const videoRef = useRef(null);
  const [lastImg,saveLastImg]=useState('');
  const [videoDem, handleVideoDem] = useState({ w: 0, h: 0 })
  const [namesanddistance, setnamesandDistance] = useState({})
  const [loading, setloading] = useState(false)
  const [danger, setdanger] = useState(false)
  const [login, setlogin] = useState(false)
  const [lastPosition, setLastPosition] = useState(0);
  // const [lastTime, setLastTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  // let [warn, setwarn] = useState('light')
  // let [warn2, setwarn2] = useState('light')
  // let [warn3, setwarn3] = useState('light')
  const [temp, setTemp] = useState({
    city_name: "",
    temp: 0,
    description: ""
  })
  const [start, setstart] = useState(false)
  const [continous, setContinous] = useState(false)
  const [stream, setStream] = useState(false);
  const [alloweddata, setalloweddata] = useState([]);
  const [lastCall, setLastCall] = useState(0)
  const [saferoad, setsaferoad] = useState(true)
  function isAvailable() {
    const currentTime = Date.now();
    if (currentTime - lastCall > 3 * 60 * 1000) {
      console.log('yes')
      setLastCall(currentTime);
      return true
    } else {
      console.log('Function was called less than 3 minutes ago');
      return false
    }
  }


  const API_KEY = '8f2e502b50c64f1caa277eecd6b32463';

  const startCamera = async () => {
    try {
      const constraints = {
        audio: false,
        video: {
          facingMode: "user" // use rear camera  "user"{ exact: "environment" }
        }
      };
      setdanger(true)
      setloading(true)
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      videoRef.current.srcObject = stream;

      let window_width = window.innerWidth
      let window_height = window.innerHeight
      handleVideoDem({ w: window_width, h: window_height })

      videoRef.current.play();

      canvas.style.position = "absolute";
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.setAttribute('width', window_width.toString());
      canvas.setAttribute('height', window_height.toString());
    } catch (err) {
    }
  };


  let intervalId;
  useEffect(() => {
    const caputerAndStream = async () => {
      if (start) {
        // console.log(start)
        await captureFrame()
        // console.log('first caputer done')
        setContinous(true)
      }
    }
    caputerAndStream()
  }, [start]);

  useEffect(() => {
    if (continous) {
      // console.log('stream')
      intervalId = setInterval(() => {
        // Put your function here that you want to run every 1 second
        captureFrame()
        // console.log('Running function every 1 second');
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [continous]);

  let weatherInterval
  useEffect(() => {
    const checkWeather = () => {
      if (lastPosition && start) {
        const { latitude, longitude } = lastPosition;
        debouncedFetchWeatherData(latitude, longitude)
      }
    }

    checkWeather()
    weatherInterval = setInterval(() => {
      checkWeather()
    }, 15 * 60 * 1000)

  }, [start])

  useEffect(() => {
    if (!start) {
      clearInterval(intervalId);
      clearInterval(weatherInterval)
      setContinous(false)
    }
  }, [start]);

  let getuserData = async (user_name) => {
    let response = await axios.get("http://localhost:5000/data", {
      headers: {
        user_name
      }
    })
    const { allow_holes_bumps, allow_pedistrian, allow_vehicle, allow_share } = response.data.result
    let oldarr = [...alloweddata]
    if (allow_holes_bumps) {
      oldarr.push('bump', 'pothole')
    }
    if (allow_pedistrian) {
      oldarr.push('person')
    }
    if (allow_vehicle) {
      oldarr.push('car', 'bus', 'bicycle', 'motorcycle', 'truck', 'train')
    }
    // console.log('oldarr', oldarr)
    setalloweddata(oldarr)
    // console.log({ allow_holes_bumps, allow_pedistrian, allow_vehicle, allow_share })
  }
  useEffect(() => {
    let islogin = localStorage.getItem('username')
    if (islogin) {
      setlogin(true)
      getuserData(islogin)
    } else {
      setlogin(false)
    }
    let watchId;
    startCamera()
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(handlePositionUpdate, handleError);
      console.log('start camera ')
    }, 2000);

    const reassureId=setInterval(() => {
      saveImage()
      console.log('save Image')
    }, 5*60*1000);
    // Cleanup function to clear the interval when the component unmounts or the effect re-runs
    
    return () => {
      clearInterval(intervalId)
      clearInterval(reassureId)
      if (stream) {
        stream.getTracks().forEach(track => {
          setstart(false)
          setloading(false)
          track.stop();
        });
        setStream(null);
      }
    };
  }, []);

  const saveImage=()=>{
    let video = document.getElementsByTagName('video')[0]
    let canvas = document.getElementsByTagName('canvas')[0];
    let context = canvas.getContext('2d');
    canvas.height = video.offsetHeight
    canvas.width = video.offsetWidth
    context?.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
    let imageData1 = canvas.toDataURL('image/png', 1.0);
    console.log(imageData1)
    saveLastImg(imageData1)
  }

  const captureFrame = async () => {
    try {
      let video = document.getElementsByTagName('video')[0]
      let canvas = document.getElementsByTagName('canvas')[0];
      let context = canvas.getContext('2d');
      canvas.height = video.offsetHeight
      canvas.width = video.offsetWidth
      context?.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
      let imageData1 = canvas.toDataURL('image/png', 1.0);
      let formData = new FormData();
      formData.append("image", imageData1);
      imageData1 = imageData1.replace('data:image/png;base64,', '')
      let res = await axios.post('http://127.0.0.1:5000/im_size', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      let detecteddata = JSON.parse(res.data.test)
      setnamesandDistance(detecteddata)
      await danger_sequence(detecteddata)
      return detecteddata
    } catch (e) {
      console.log(e);
      return ''
    }
  };

  // danger sequence
  let danger_sequence = (myDetectedData) => {
    let { name, distance } = myDetectedData
    let name_keys = Object.getOwnPropertyNames(name)
    for (let key in name_keys) {
      let dist = distance[key]
      let braking = calculateBrakingDistance(dist, 10)
      console.log(braking)
      warning(braking, name[key])

    }
  }

  // danger tracking part 

  const debouncedFetchWeatherData = (latitude, longitude) => {
    const API_LOCATION_URL = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&tz=local&key=${API_KEY}`
    axios.get(API_LOCATION_URL)
      .then(response => {
        let { data } = response
        let description = data.data[0].weather.description.toLowerCase()
        let isNotSuitable = description.includes('fog') || description.includes('haze') || description.includes('heavy')
        let d = data.data[0]
        let newTemp = { ...temp }
        newTemp['city_name'] = d.city_name
        newTemp['temp'] = d.temp
        newTemp['description'] = description
        newTemp['icon'] = d.weather.icon
        newTemp['notsafe'] = isNotSuitable
        setTemp(newTemp)
        console.log(data);
        console.log(description)
        console.log(isNotSuitable)
        // handle the weather data here
      })
      .catch(error => {
        console.error(error);
      });
  }// debounce for 1 second (1000 milliseconds)


  function handlePositionUpdate(position) {
    let { latitude, longitude, timestamp } = position.coords;
    if (!timestamp) {
      timestamp = Date.now()
    }
    if (lastPosition) {
      const { latitude: lastLat, longitude: lastLng, timestamp: lastTimestamp, speed: lastSpeed } = lastPosition;

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

  function calculateBrakingDistance(dis, speed) {
    let distance = dis - ((speed * speed) / 16)
    return distance
  }

  function warning(brakingdistance, name) {
    // howa mafrod zero bs 3amleen 7esab en el user mmkn ykon rd f3lu batee2 aw el net batee2 
    if (brakingdistance <= 0) {
      setsaferoad(false)
    }
    if (alloweddata.includes(name)) {
      console.log('d5l bel name')
      let available = isAvailable()
      console.log(available)
      if (brakingdistance <= 6 && available) {
        let dist = parseInt(brakingdistance)
        let text = `${name} is at less that ${dist} meters`
        speak(text)
      }
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
  let logout = () => {
    localStorage.removeItem('username')
    setlogin(false)
  }
  return (
    <div className='h-100 d-flex flex-column signUpScreen'>
      <div className='d-flex justify-content-between px-3'>
        <div className='d-flex  '>
          <div className='d-flex flex-column'>
            <p className={`text-dark m-0`}><span className='fw-bold'>city: </span>{temp.city_name} </p>
            <p className={`text-dark m-0 fs-5`}><span className=' fw-bold'>temperture: </span>{temp.temp} C</p>
            <p className={`text-dark m-0`}><span className='fw-bold'>state: </span>{temp.description}</p>
          </div>
          <div>
            <img src={`https://www.weatherbit.io/static/img/icons/${temp.icon}.png`} className='w-50' alt="" />
          </div>
        </div>
        <div className='d-flex  icons align-items-start'>
          {login ? <img src={account} onClick={() => { navto('/prof') }} className='mx-1' alt="" /> : <></>}
          {login ? <img src={settings} onClick={() => { navto('/set') }} className='mx-1' alt="" /> : <></>}
          {login ? <button className='btn btn-danger p-1 mx-1 ' onClick={() => { logout() }}>logout</button> : <button className='btn btn-success p-1 mx-1' onClick={() => { navto('/login') }}>login</button>}
        </div>
      </div>
      <div className='px-3'>{temp.notsafe ? <span className='text-danger fw-bold'>Danger weather Application may not help</span> : <span className='text-success fw-bold'>safe weather for driving</span>}</div>
      <div className='video-container h-100 d-flex align-items-center'>
        <video ref={videoRef} className='vid' />
        <canvas className='d-none' id='canvas' />
        <div className='speed'>
          <p className={`text-dark mb-0`}><span className=' fw-bold'>Speed:</span> {speed && speed.toFixed(2)} m/s</p>
          <div className='px-3'>{!saferoad ? <span className='text-danger fw-bold'>You have to slow down </span> : <span className='text-success fw-bold'>Safe distance</span>}</div>

        </div>
      </div>
      <div className='but d-flex justify-content-center col-12'>
        {start ? <button onClick={() => { setstart(false) }} className='btn btn-danger m-1'>Stop Ride</button> : <button onClick={() => { setstart(true) }} className='btn btn-success m-1'>Start Ride</button>}
      </div>

    </div>
    // <Speed />
  );
};

export default Camera;