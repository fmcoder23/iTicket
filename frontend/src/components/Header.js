import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaRegHeart } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { IoMdCart } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { SummaryApi } from '../common';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 

  const fetchUser = async () => {
    const res = await fetch(SummaryApi.users.get_by_id + localStorage.getItem("userId"), {
      headers: { 'token': localStorage.getItem('token') }
    });
    const d = await res.json();
    if (!res.ok) {
      console.log(d.message);
      return;
    }
    setUserData(d.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('userId'); 
    setUserData(null); 
    navigate('/login'); 
  };

  return (
    <div className='w-full h-16 bg-white shadow-xl'>
      <div className='h-full flex justify-between px-12 lg:px-16 items-center'>
        <Link to={''}>
          <h2 className='text-yellow-600 text-xl font-medium'>buyticket.uz</h2>
        </Link>

        <div className='flex justify-between w-80 lg:w-[35vw]'>
          <Link to={'/events'} className='text-slate-700 text-lg'>Events</Link>
          <Link to={'/events?category=Sports'} className='text-slate-700 text-lg'>Sports</Link>
          <Link to={'/events?category=Concerts'} className='text-slate-700 text-lg'>Concerts</Link>
        </div>

        <div className='flex justify-between items-center gap-4 lg:gap-8'>
          <Link to={'/favorite'} className='text-black lg:text-2xl'><FaRegHeart /></Link>
          <Link to={'/search'} className='text-black lg:text-2xl'><IoMdSearch /></Link>
          <Link to={'/cart'} className='text-black lg:text-2xl'><IoMdCart /></Link>
          <div className='relative group flex justify-center'>
            <div onClick={() => setShowMenu(p => !p)} className='bg-yellow-500 p-2 rounded-full cursor-pointer'>
              <FaRegUser className="text-white" />
            </div>
            {showMenu && (
              <div className='absolute top-full mt-2 bg-white p-4 shadow-lg rounded z-50'> {/* z-index set to 50 */}
                {userData && (
                  <div className='flex flex-col items-start'>
                    <p className='text-base font-medium text-gray-700'>{userData.fullname}</p>
                    <p className='text-sm text-gray-500'>{userData.email}</p>
                    <button 
                      className='mt-4 w-full text-red-500 hover:underline text-left'
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
