import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import Context from './context';
import EventPage from './pages/EventPage'
import useDispatch from 'react-redux'
import { SummaryApi } from './common';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  // const fetchUserDetails = async () => {
  //   const data = await fetch(SummaryApi.users.get_by_id, { method:'get', credentials: 'include' })
  //   if (data.success) {
  //     dispatch(setUserDetails(data.data))
  //   }
  // }
  return (
    <div className="">
      <Context.Provider value={{}}>
      <div className=''>
      <Header />
      <main className=' min-h-[calc(100vh-4rem)]'>
        <Outlet />
      </main>
      <Footer />
      </div>
      </Context.Provider>
    </div>
  );
}

export default App;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiNGM2MTg1LWQwNjUtNDBlOS04YjdkLWJjYjZjY2ViMzM0NCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MjMxOTA2OTQsImV4cCI6MTc1NDcyNjY5NH0.U8OCa98b7kqldDh5PRKUSDvc-QcmATQ1lS22Y9UKL00