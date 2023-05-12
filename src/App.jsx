
import './App.css';
import Camera from './Camera/Camera';
import sorry from './images/58707-size.gif';
import Layout from './Layout/Layout';
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import Home from './HomePage/Home';
import Signup from './Signup/Signup';
import Login from './LoginPage/Login';
import Profile from './UserProfile/Profile';
import Settings from './Sittings/Settings';
// import Temprory from './Temprory/Temprory';
import Start from './StartingPage/Start';
import { useState, useEffect } from 'react';


function App() {
  function Routing(){
    let user = localStorage.getItem('username')
    if(user){
      return <Camera/>
    }
    return <Login/>
  }
  let myRoutes = createBrowserRouter([
    {
      path: '/', element: <Layout />,
      children: [
        { index: true, element: <Routing/> },
        { path: '/reg', element: <Signup /> },
        { path: '/login', element: <Login /> },
        { path: '/camera', element: <Camera /> },
        { path: '/prof', element: <Profile /> },
        { path: '/set', element: <Settings /> }
      ]
    }
  ])
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className='screens h-100'>{showSplashScreen ? <Start /> : <RouterProvider router={myRoutes}></RouterProvider>}</div>
      <div className='text-dark bg-white h-100 d-flex flex-column align-items-center w-100 justify-content-center screen-invert'> <img src={sorry} className='warn-width' alt="" />
        <p className='position-absolute top-50 fw-bold fs-3 warn-txt text-light rounded rounded-3 p-3 screen-invert'>sorry application works on mobiles and tablets with maximum width 768v    px</p>
      </div>
    </>
    // <Start/>

  );
}

export default App;
