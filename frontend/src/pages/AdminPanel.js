import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { SummaryApi } from '../common'

export const AdminPanel = () => {
    const navigate = useNavigate()
    const [user, setUserData] = useState(null)

    const fetchUser = async () => {
        const res = await fetch(SummaryApi.users.get_by_id + localStorage.getItem("userId"),{
            headers:{'token':localStorage.getItem('token')}})
        const d = await res.json()
        if (!res.ok) {
            console.log(d.message)
            return
        }
        setUserData(d.data)
    }

    useEffect(() => {
        fetchUser()
    }, [])
    return (
        <div className='min-h-[calc(100vh-120px)]  flex shadow-md'>
            <aside className='bg-white min-h-full w-full max-w-60 border-[3px] ring-1 '>
                <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-3xl cursor-pointer'>
                        {
                            user?.profilePic ? (
                                <imh src={user.profilePic} />
                            ) : <FaUserCircle />
                        }
                    </div>
                    <p className='capitalize'>{user?.name}</p>
                </div>
                <div >
                    <nav className='grid p-4 text-lg'>
                        <Link to={'users'} className='px-2 py-2 hover:bg-slate-100'>All users</Link>
                        <Link to={'places'} className='px-2 py-2 hover:bg-slate-100'>Places</Link>
                        <Link to={'categories'} className='px-2 py-2 hover:bg-slate-100'>Categories</Link>
                        <Link to={'events'} className='px-2 py-2 hover:bg-slate-100'>Events</Link>
                        <Link to={'banners'} className='px-2 py-2 hover:bg-slate-100'>Banners</Link>
                        <Link to={'contacts'} className='px-2 py-2 hover:bg-slate-100'>Contacts</Link>
                    </nav>
                </div>
            </aside>

            <main className='grid w-full h-full p-2'>
                <Outlet />
            </main>
        </div>
    )
}

export default AdminPanel