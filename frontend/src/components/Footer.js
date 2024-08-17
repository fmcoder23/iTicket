import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className=' w-full h-fit bg-indigo-500 py-6'>
            <div className='py-3 flex flex-col h-56 bg-indigo-600 '>
                <div className='flex items-center w-full p-4 px-16 h-16 justify-between border-b-2 border-slate-400'>
                    <p className='text-yellow-600 text-3xl font-thin'>buyticket.uz</p>
                    <p className='text-white font-thin'>© 2024 BUYTICKET.UZ. ALL RIGHTS RESERVED</p>
                </div>

                <div className=' flex items-center w-full py-4 px-16 h-full justify-between'>
                    <div className=' h-full pr-28 flex items-center w-full py-1 justify-between border-r'>
                        <div className=' h-full flex flex-col justify-between text-lg font-medium text-white'>
                            <p>FAQ</p>
                            <p>Support</p>
                            <p>Terms & Conditions</p>
                            <p>Privacy Policy</p>
                        </div>
                        <div className='flex h-full flex-col justify-between  text-lg font-medium text-white'>
                            <p>About</p>
                            <p>Point of Sales</p>
                            <Link to={'/testimonials'}>Testimonials</Link>
                            <Link to={'/contact'}>Contact</Link>
                        </div>
                        <div className=' h-full flex flex-col justify-between text-lg font-medium text-white'>
                            <p>Facebook</p>
                            <p>Instagram</p>
                            <p>telegram</p>
                        </div>
                    </div>
                    <div className='mx-4 w-56 text-white'>
                        <p>Subscribe Newsletter</p>
                        <Link to={'/register'}>Register</Link>
                        <p></p>
                        <Link to={'/login'}>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer

// < svg width = "397" height = "85" viewBox = "0 0 397 85" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
//                             <mask id="path-1-inside-1_27_411" fill="white">
//                                 <path d="M0 0H397V85H0V0Z" />
//                             </mask>
//                             <path d="M0 0H397V85H0V0Z" fill="#4056A1" />
//                             <path d="M0 7H397V-7H0V7ZM397 78H0V92H397V78Z" fill="#5E70BB" mask="url(#path-1-inside-1_27_411)" />
//                         </svg >