import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { SummaryApi } from '../common';
import Popup from './Popup'; // Import the Popup component

const month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', "August", 'September', 'October', 'November', 'December'];

function EventCard({ event, isFav, cb = { update: () => { }, rem: () => { } } }) {
    const [date, setDate] = useState(new Date(event.createdAt));
    const [popupMessage, setPopupMessage] = useState(null); // State to manage popup message
    const [popupType, setPopupType] = useState(''); // State to manage popup type

    useEffect(() => {
        setDate(new Date(event.createdAt));
    }, [event, cb]);

    const addToFavorite = async () => {
        try {
            const res = await fetch(SummaryApi.events.add_to_favorite.url + event.id + SummaryApi.events.add_to_favorite.end, {
                method: SummaryApi.events.add_to_favorite.method,
                headers: { 'token': localStorage.getItem('token') }
            });

            const d = await res.json();

            if (!res.ok) {
                setPopupMessage(d.message);
                setPopupType('error');
                return;
            }

            setPopupMessage('Favorite added successfully!');
            setPopupType('success');
            // cb.update();
        } catch (error) {
            setPopupMessage('An error occurred while adding to favorites.');
            setPopupType('error');
        }
    };

    return (
        <div className='w-96 h-[550px] rounded-2xl shadow-[0px_5px_10px_rgba(.01,.01,.01,.5)] overflow-hidden bg-slate-100'>
            <div className='h-[50%] bg-yellow-100'>
                <img src={`http://localhost:3001/${event.photo}`} alt={event.name} className='w-full h-full object-cover' />
            </div>
            <div className='p-4 flex flex-col justify-between h-[50%]'>
                <div onClick={() => { !isFav ? addToFavorite() : cb.rem && cb.rem() }} className='cursor-pointer text-2xl mr-auto ml-[21rem] mt-8'>
                    {
                        isFav ? (<div className='text-red-500'><FaHeart className='' /></div>) : (<FaRegHeart />)
                    }
                </div>
                <div className='p-4 container'>
                    <div>
                        <h2 className='text-2xl font-bold w-[80%] text-yellow-600 text-ellipsis overflow-hidden whitespace-nowrap'>{event.name}</h2>
                        <h2 className='text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap'>{event.name}</h2>
                        <p>{date.getDate() + ' ' + month[date.getMonth()]}</p>
                        <p>{date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0')}</p>
                    </div>
                </div>
                <Link to={'/event/' + event.id} className='hover:scale-105 h-10 py-1 float-end mt-4 mb-2 text-center text-lg font-medium bg-yellow-600 w-[96%] mx-auto rounded-full'>Buy Ticket</Link>
            </div>

            {popupMessage && (
                <Popup
                    message={popupMessage}
                    type={popupType}
                    onClose={() => setPopupMessage(null)}
                />
            )}
        </div>
    );
}

export default EventCard;
