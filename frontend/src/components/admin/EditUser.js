import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { SummaryApi } from '../../common';

function EditUser({ user, cb }) {
    const [changes, setChanges] = useState({
        role: user.isAdmin ? "Admin" : "General",
        fullname: user.fullname,
        password: '',
    })

    const handleChange = (e) => {
        
        setChanges(p => {
            return {
                ...p,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch(SummaryApi.users.put + user.id, {
            method: 'put',
            headers: { 'content-type':'application/json', 'token': localStorage.getItem('token') },
            body: JSON.stringify({ ...changes, email: user.email, isAdmin: changes.role == "Admin",role:undefined })
        })
        const d = await res.json()
        if(!res.ok){
            alert(d.message)
            return
        }
        console.log(d.data)
        cb.update()
        cb.close()
    }

    return (
        <div className='z-50 fixed w-full  h-full bg-slate-200 bg-opacity-55 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='lg:w-[40%] min-w-[360px] md:w-[60%] sm:w-[60%] h-fit pb-4 bg-white rounded-xl shadow1'>
                <div className='flex justify-between m-4 items-center text-lg'>
                    <h2 className='font-medium'>Edit user</h2>
                    <RxCross2 onClick={cb.close} />
                </div>
                <form>
                    <div className='mx-8 flex flex-col gap-2'>
                        <div className='flex justify-between'>
                            <p>Full name:</p>
                            <input required className='border' type='text' value={changes.fullname} name='fullname' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>New password:</p>
                            <input required className='border' type='password' name='password' value={changes.password} placeholder='enter new password' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Role:</p>
                            <select value={changes.role} name='role' onChange={handleChange} className='border w-32'>
                                <option value={'Admin'} >Admin</option>
                                <option value={'General'}>General</option>
                            </select>
                        </div>
                        <button onClick={handleSubmit} className='editButton'>Change</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUser