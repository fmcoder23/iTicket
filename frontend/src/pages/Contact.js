import React, { useState } from 'react';
import { SummaryApi } from '../common';
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

function Contact() {
  const [inputData, setInputData] = useState({ message: '', phone: '' });
  const [loading, setLoading] = useState(false); // Loading state

  // Handle input change and format phone number
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Format phone number to '+998 99 602 31 27' pattern
      const formattedValue = formatPhoneNumber(value);
      setInputData((p) => ({
        ...p,
        [name]: formattedValue,
      }));
    } else {
      setInputData((p) => ({
        ...p,
        [name]: value,
      }));
    }
  };

  // Function to format phone number
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters except '+'
    const cleanedValue = value.replace(/[^+\d]/g, '');
    
    // Add +998 prefix if not present
    const hasPrefix = cleanedValue.startsWith('+998');
    const baseValue = hasPrefix ? cleanedValue.slice(4) : cleanedValue;

    // Format the cleaned value
    const match = baseValue.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    
    return cleanedValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const res = await fetch(SummaryApi.contacts.post, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify(inputData),
      });
      const d = await res.json();
      if (!res.ok) {
        alert(d.message);
      } else {
        alert('Message sent successfully');
        setInputData({ message: '', phone: '' }); // Clear form after submission
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className='my-4 mx-6'>
      <div className='flex items-center gap-4'>
        <div className='w-2 h-8 bg-yellow-500'></div>
        <h2 className='text-3xl font-semibold py-4 text-blue-900 capitalize'>Contact</h2>
      </div>

      <div className='pt-4 pb-8 px-8 rounded-xl shadow-[0px_5px_10px_rgba(.01,.01,.01,.5)] lg:w-[50%] md:w-[65%] mx-auto h-fit mt-8'>
        <div className='flex items-center gap-4'>
          <div className='w-2 h-8 bg-yellow-500'></div>
          <h2 className='text-2xl font-semibold py-4 text-blue-900 capitalize'>Write your text here...</h2>
        </div>

        <div className='mx-4'>
          <form onSubmit={handleSubmit}>
            <textarea
              name='message'
              required
              value={inputData.message}
              onChange={handleInput}
              placeholder='Text Message'
              className='border-2 rounded-lg w-full p-2'
              rows={7}
              disabled={loading} // Disable input while loading
            />
            <input
              type='text'
              name='phone'
              required
              value={inputData.phone}
              onChange={handleInput}
              placeholder='Enter Your Phone Number'
              className='border-2 rounded-lg w-[60%] h-10 mt-4 px-2'
              pattern="\+998 \d{2} \d{3} \d{2} \d{2}"
              disabled={loading} // Disable input while loading
            />
            <button
              type='submit'
              className={`w-full bg-blue-700 rounded-xl h-10 mt-6 text-lg font-bold text-white hover:scale-105 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <FaSpinner className="animate-spin mr-2" /> Submitting...
                </div>
              ) : (
                'SUBMIT'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
