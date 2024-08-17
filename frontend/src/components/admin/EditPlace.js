import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { SummaryApi } from '../../common';

function EditPlace({ place, cb }) {
    const [changes, setChanges] = useState({
        rows: place.rows,
        name: place.name,
        columns:place.columns,
        firstRowPrice:place.firstRowPrice,
        priceDifByRow:place.priceDifByRow,
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
        const res = await fetch(SummaryApi.places.put + place.id, {
            method: 'put',
            headers: { 'content-type':'application/json', 'token': localStorage.getItem('token') },
            body: JSON.stringify({ ...changes })
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
                            <p>Name:</p>
                            <input required className='border' type='text' value={changes.name} name='name' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Rows:</p>
                            <input required className='border' type='number' value={changes.rows} name='rows' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Columns:</p>
                            <input required className='border' type='number' name='columns' value={changes.columns} placeholder='enter new password' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>First row price:</p>
                            <input required className='border' type='number' name='firstRowPrice' value={changes.firstRowPrice} placeholder='enter new password' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Price diff by row:</p>
                            <input required className='border' type='number' name='priceDifByRow' value={changes.priceDifByRow} placeholder='enter new password' onChange={handleChange} />
                        </div>
                        <button onClick={handleSubmit} className='editButton'>Change</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditPlace