import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { SummaryApi } from '../../common';

const copyFD = (fd, data) => {
    Object.keys(data).forEach(k => {
        if (k === 'category' || k === 'place') {
            fd.append(k + 'Id', data[k].id);
        } else {
            fd.append(k, data[k]);
        }
    });
}

function CreateEvent({ cb, categories, places }) {
    const [changes, setChanges] = useState({
        name: '',
        description: '',
        datetime: '',
        phone1: '',
        phone2: '',
        category: categories[0],
        minEventPrice: '',
        place: places[0],
    });
    
    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChanges(prev => ({
            ...prev,
            [name]: name === 'category' ? categories.find(c => c.id === value) :
                name === 'place' ? places.find(c => c.id === value) :
                value
        }));
    };

    const handlePhoto = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        copyFD(fd, changes);
        if (photo) {
            fd.append('photo', photo);
        }
        try {
            const res = await fetch(SummaryApi.events.post, {
                method: 'POST',
                headers: { 'token': localStorage.getItem('token') }, // Headers should not include Content-Type when using FormData
                body: fd
            });
            const d = await res.json();
            if (!res.ok) {
                alert(d.message || 'Failed to create event');
                return;
            }
            console.log(d.data);
            cb.update();
            cb.close();
        } catch (error) {
            console.error('Error creating event:', error);
            alert('An error occurred while creating the event.');
        }
    };

    return (
        <div className='z-50 fixed w-full h-full bg-slate-200 bg-opacity-55 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='lg:w-[30%] min-w-[360px] md:w-[60%] sm:w-[60%] h-fit pb-4 bg-white rounded-xl shadow1'>
                <div className='flex justify-between m-4 items-center text-lg'>
                    <h2 className='font-medium'>Create Event</h2>
                    <RxCross2 onClick={cb.close} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='mx-8 flex flex-col gap-2'>
                        <div className='flex justify-between'>
                            <p>Name:</p>
                            <input required className='border' type='text' value={changes.name} name='name' onChange={handleChange} />
                        </div>
                        <div>
                            <p>Description:</p>
                            <textarea rows={7} className='w-full border' required value={changes.description} name='description' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Date time:</p>
                            <input required className='border' type='date' value={changes.datetime} name='datetime' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Phone 1:</p>
                            <input required className='border' type='text' value={changes.phone1} name='phone1' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Phone 2:</p>
                            <input required className='border' type='text' value={changes.phone2} name='phone2' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Category:</p>
                            <select name='category' value={changes.category.id} onChange={handleChange}>
                                {
                                    categories?.map((c, id) => (
                                        <option value={c.id} key={id}>{c.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='flex justify-between'>
                            <p>Place:</p>
                            <select name='place' value={changes.place.id} onChange={handleChange}>
                                {
                                    places?.map((c, id) => (
                                        <option value={c.id} key={id}>{c.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='flex justify-between'>
                            <p>Min event price:</p>
                            <input required className='border' type='text' value={changes.minEventPrice} name='minEventPrice' onChange={handleChange} />
                        </div>
                        <div className='flex justify-between'>
                            <p>Photo:</p>
                            <input className='border' type='file' name='photo' onChange={handlePhoto} />
                        </div>
                        <button type='submit' className='editButton'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;
