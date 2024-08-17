import React, { useEffect, useRef, useState } from 'react';
import TestimonialCard from '../components/TestimonialCard';
import { SummaryApi } from '../common';
import { FaAngleLeft, FaAngleRight, FaRegStar, FaStar } from "react-icons/fa";

function Testimonials() {
  const [data, setData] = useState([]);
  const scrollElement = useRef();
  const [inputData, setInputData] = useState({ feedback: '', rank: 0, picture: null });
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const fetchData = async () => {
    const res = await fetch(SummaryApi.testimonials.get);
    const d = await res.json();
    setData(d.data);
    console.log(d.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleText = (e) => {
    setInputData(p => ({
      ...p,
      feedback: e.target.value
    }));
  };

  const handleUploadPic = (e) => {
    setInputData(p => ({
      ...p,
      picture: e.target.files[0]
    }));
  };

  const handleSubmit = async () => {
    const t = data.find(e => e.userId === localStorage.getItem('userId'));
    const fd = new FormData();
    fd.append('photo', inputData.picture);
    fd.append('text', inputData.feedback);
    fd.append('rank', inputData.rank);
    let res;
    if (!t) {
      res = await fetch(SummaryApi.testimonials.post, { method: 'post', headers: { 'token': localStorage.getItem('token') }, body: fd });
    } else {
      res = await fetch(SummaryApi.testimonials.put + t.id, { method: 'put', headers: { 'token': localStorage.getItem('token') }, body: fd });
    }
    const d = await res.json();
    if (!res.ok) {
      setPopupMessage(d.message);
    } else {
      setPopupMessage('Testimonial submitted successfully!');
      fetchData();
    }
    setShowPopup(true);
  };

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  const arr = [0, 0, 0, 0, 0];

  return (
    <div className='my-8 mx-6'>
      <div className='flex items-center gap-4'>
        <div className='w-2 h-8 bg-yellow-500 rounded'></div>
        <h2 className='text-4xl font-bold text-blue-900 capitalize'>Testimonials</h2>
      </div>

      <div className='relative my-12'>
        <button className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform' onClick={scrollLeft}>
          <FaAngleLeft className='text-3xl text-blue-900' />
        </button>
        <button className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-110 transition-transform' onClick={scrollRight}>
          <FaAngleRight className='text-3xl text-blue-900' />
        </button>
        <div className='flex items-center gap-12 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>
          {data.map((t, id) => (
            <TestimonialCard testimonial={t} key={id} />
          ))}
        </div>
      </div>

      <div className='mt-16 rounded-xl shadow-lg bg-white p-8 w-full max-w-3xl mx-auto'>
        <div className='flex items-center gap-4'>
          <div className='w-2 h-8 bg-yellow-500 rounded'></div>
          <h2 className='text-3xl font-bold text-blue-900 capitalize'>Write Your Testimonial Here</h2>
        </div>
        <div className='mt-8'>
          <textarea
            onChange={handleText}
            value={inputData.feedback}
            className='w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
            placeholder='Write your feedback'
            cols={33}
            rows={7}
          />
          <label>
            <div className='mt-4 cursor-pointer text-center w-32 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition'>
              <p className='text-lg font-medium'>Upload picture</p>
              <input type='file' className='hidden' onChange={handleUploadPic} />
            </div>
          </label>

          <div className='text-yellow-500 mt-6 flex gap-2 items-center'>
            <p className='text-black'>Rank: </p>
            {arr.map((_, id) => (
              id >= inputData.rank
                ? <FaRegStar key={id} onClick={() => setInputData(p => ({ ...p, rank: id + 1 }))} className='cursor-pointer text-2xl' />
                : <FaStar key={id} onClick={() => setInputData(p => ({ ...p, rank: id + 1 }))} className='cursor-pointer text-2xl' />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className='mt-8 w-full h-12 rounded-lg bg-blue-700 text-white text-lg font-bold hover:bg-blue-800 transition-transform hover:scale-105'
          >
            SUBMIT
          </button>
        </div>
      </div>

      {showPopup && (
        <div className='fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-lg shadow-lg'>
          <p>{popupMessage}</p>
          <button
            onClick={() => setShowPopup(false)}
            className='mt-2 bg-white text-green-500 px-4 py-2 rounded hover:bg-green-100 transition'
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Testimonials;
