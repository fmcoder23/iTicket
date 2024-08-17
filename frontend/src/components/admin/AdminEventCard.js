// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { FaRegHeart } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa";
// import { SummaryApi } from '../../common';
// import { MdEdit } from "react-icons/md";

// const month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', "August", 'September', 'October', 'November', 'December']

// function AdminEventCard({ event, cb }) {
//     const [date, setdate] = useState(new Date(event.createdAt))

//     useEffect(() => {
//         setdate(new Date(event.createdAt))
//     }, [event])

//     return (
//         <div className='w-72 h-[395px] rounded-2xl shadow-[0px_5px_10px_rgba(.01,.01,.01,.5)]  overflow-hidden bg-slate-100'>
//             <div className='h-[40%] bg-yellow-100'>
//                 <img className='w-full h-full' src={'http://localhost:3001/api/loadImg/' + event.photo}></img>
//             </div>
//             <div className='p-2 flex flex-col justify-between h-fit'>

//                 <div className='pt-4 px-4 container'>
//                     <div>
//                         <h2 className='text-2xl font-bold w-[80%] text-yellow-600 text-ellipsis overflow-hidden whitespace-nowrap' >{event.name}</h2>
//                         <h2 className='text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap'>{event.place.name}</h2>
//                         <p>{date.getDay() + ' ' + month[date.getMonth()]}</p>
//                         <p>{date.getHours() + ':' + (date.getMinutes())}</p>
//                     </div>
//                 </div>
//                 <button onClick={()=>cb.edit(event)} className='w-full mt-3 h-10 rounded-lg font-bold bg-blue-700 border-2 border-blue-700 text-white hover:bg-white hover:text-blue-700'>Edit</button>
//                 <button onClick={()=>cb.delete(event.id)} className='w-full mt-2 h-10 rounded-lg font-bold bg-blue-700 border-2 border-blue-700 text-white hover:bg-white hover:text-blue-700'>Delete</button>

//             </div>
//         </div>
//     )
// }

// export default AdminEventCard

import React, { useEffect, useState } from 'react'
import { MdEdit } from "react-icons/md";

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', "August", 'September', 'October', 'November', 'December']

function AdminEventCard({ event, cb }) {
    const [date, setDate] = useState(new Date(event.createdAt));

    useEffect(() => {
        setDate(new Date(event.createdAt));
    }, [event]);

    return (
        <div className='w-72 h-[395px] rounded-2xl shadow-[0px_5px_10px_rgba(.01,.01,.01,.5)]  overflow-hidden bg-slate-100'>
            <div className='h-[40%] bg-yellow-100'>
                <img 
                    className='w-full h-full object-cover' 
                    src={'http://localhost:3001/' + event.photo} 
                    alt={event.name + " image"}
                />
            </div>
            <div className='p-2 flex flex-col justify-between h-fit'>
                <div className='pt-4 px-4 container'>
                    <div>
                        <h2 className='text-2xl font-bold w-[80%] text-yellow-600 text-ellipsis overflow-hidden whitespace-nowrap'>
                            {event.name}
                        </h2>
                        <h2 className='text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap'>
                            {event.place.name}
                        </h2>
                        <p>{date.getDate() + ' ' + month[date.getMonth()]}</p>
                        <p>{date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')}</p>
                    </div>
                </div>
                <button 
                    onClick={() => cb.edit(event)} 
                    className='w-full mt-3 h-10 rounded-lg font-bold bg-blue-700 border-2 border-blue-700 text-white hover:bg-white hover:text-blue-700'
                >
                    Edit
                </button>
                <button 
                    onClick={() => cb.delete(event.id)} 
                    className='w-full mt-2 h-10 rounded-lg font-bold bg-blue-700 border-2 border-blue-700 text-white hover:bg-white hover:text-blue-700'
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default AdminEventCard;
