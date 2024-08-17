import { useEffect, useState } from 'react';
import { SummaryApi } from '../common';
import { FaStar,FaRegStar } from "react-icons/fa";

const month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', "August", 'September', 'October', 'November', 'December']

function TestimonialCard({ testimonial }) {
    
    const arr=[1,2,3,4,5]
    return (
        <div className='w-80 h-[440px] rounded-2xl shadow-[0px_5px_10px_rgba(.01,.01,.01,.5)]  overflow-hidden bg-slate-100'>
            <div className='h-fit'>
                <div className='size-48 mx-auto mt-4 rounded-full overflow-hidden bg-yellow-200'>
                <img src={`http://localhost:3001/${testimonial.photo}`}/>
                </div>
                <p className='w-fit mt-2 mx-auto text-[32px] text-blue-500 font-medium'>{testimonial?.user.name}</p>
            </div>
            <div className='p-2 flex  mx-6 my-2'>
                <div className='w-2 h-32 bg-yellow-500'></div>
                <p className=' p-2 h-fit max-h-32 overflow-scroll scrollbar-none text-md text-gray-800 font-medium'>{testimonial?.text}</p>
            </div>
            <div className='mt-6 w-fit mx-auto flex gap-2 text-xl text-orange-400'>
                {
                    arr.map(e=>{
                        if(e <= testimonial.rank)return <FaStar/>
                        return <FaRegStar/>
                    })
                }
            </div>
        </div>
    )
}

export default TestimonialCard
