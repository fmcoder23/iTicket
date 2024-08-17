// import React, { useEffect, useState } from 'react'
// import { SummaryApi } from '../../common'
// import { MdDeleteForever } from "react-icons/md";
// import { RxCross2 } from 'react-icons/rx';

// function Banners() {
//     const [events, setEvents] = useState([])
//     const [banners, setBanners] = useState([])
//     const [create, setCreate] = useState({ show: false })
//     const [eventId,setEventId] = useState(null)
//     const [photo,setPhoto] = useState(null)

//     const fetchEvents = async () => {
//         const res = await fetch(SummaryApi.events.get, { headers: { 'token': localStorage.getItem('token') } })
//         const d = await res.json()
//         if (!res.ok) {

//             return
//         }
//         setEvents(d.data)
//     }

//     const fetchBanners = async () => {
//         const res = await fetch(SummaryApi.banners.get, { headers: { 'token': localStorage.getItem('token') } })
//         const d = await res.json()
//         if (!res.ok) {
//             console.log(d.message)
//             return
//         }
        
//         setBanners(d.data.reverse())
//     }
//     const deleteBanner = async (id) => {
//         const res = await fetch(SummaryApi.banners.delete + id,{method:'delete', headers: { 'token': localStorage.getItem('token') } })
//         const d = await res.json()
//         if (!res.ok) {
//             console.log(d.message)
//             return
//         }
//         fetchBanners()
//     }
//     const handleCreate = async(e)=>{
//         console.log('qwfwe')
//         e.preventDefault()
//         const fd = new FormData()
//         fd.append('eventId',eventId)
//         fd.append('photo',photo)
//         const res = await fetch(SummaryApi.banners.post, { 
//             method:'post',
//             body:fd,
//             headers: { 'token': localStorage.getItem('token') } })
//         const d = await res.json()
//         if (!res.ok) {
//             console.log(d.message)
//             return
//         }
//         fetchBanners()
//         setCreate({show:false})
//     }
//     const handleChangePhoto = async(e,b)=>{
        
//         const fd = new FormData()
//         fd.append('eventId',b.eventId)
//         fd.append('photo',e.target.files[0])
//         const res = await fetch(SummaryApi.banners.put + b.id, { 
//             method:'put',
//             body:fd,
//             headers: { 'token': localStorage.getItem('token') } })
//         const d = await res.json()
//         if (!res.ok) {
//             console.log(d.message)
//             return
//         }
//         fetchBanners()
//     }
//     useEffect(() => {
//         fetchEvents()
//     }, [])
//     useEffect(() => {
//         fetchBanners()
//     }, [])
//     return (
//         <div>
//             <div className='mb-1 flex justify-between px-4 items-center mt-3 w-full h-14 shadow1 rounded-md'>
//                 <p className='text-lg'>All banners</p>
//                 <button onClick={() => setCreate({ show: true })} className='border rounded px-3 bg-slate-100 hover:bg-slate-200'>Create banner</button>
//             </div>

//             <div className=''>
//                 {
//                     banners.length !== 0 && (
//                         banners.map((b, id) => {
//                             return <div className='mt-4 p-4 h-[360px] lg:h-[450px] w-full shadow-md rounded-lg'>
//                                 <label>
//                                 <div className='w-full h-[90%]'>
//                                     <img src={SummaryApi.loadImg.url + b.photo} className='w-full h-full' />
//                                     <input type='file' className='hidden' onChange={(e)=>handleChangePhoto(e,b)}/>
//                                 </div>
//                                 </label>
//                                 <div className='flex mt-3 items-center gap-12'>
//                                     <p>Event:</p>
//                                     <select value={b.eventId} className='border'>
//                                         {
//                                             events?.map((e, id) => {
//                                                 return <option value={e.id}>{e.name}</option>
//                                             })
//                                         }
//                                     </select>
//                                     <div className='w-full'></div>
//                                     <div onClick={() => deleteBanner(b.id)} className='text-lg rounded-full bg-red-200 hover:bg-red-500 hover:text-white p-1 float-end'><MdDeleteForever /></div>
//                                 </div>
//                             </div>
//                         })
//                     )
//                 }
//             </div>

//             {
//                 create.show && (
//                     <div className='z-50 fixed w-full  h-full bg-slate-200 bg-opacity-55 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
//                         <div className='lg:w-[30%] min-w-[360px] md:w-[60%] sm:w-[60%] h-fit pb-4 bg-white rounded-xl shadow1'>
//                             <div className='flex justify-between m-4 items-center text-lg'>
//                                 <h2 className='font-medium'>Edit event</h2>
//                                 <RxCross2 onClick={() => setCreate({ show: false })} />
//                             </div>
//                             <form className='m-4'>
//                                 <label>Photo: </label>
//                                 <input type='file' onChange={(e)=>setPhoto(e.target.files[0])}/>

//                                 <div className='flex mt-6 items-center gap-12'>
//                                     <p>Event:</p>
//                                     <select onChange={(e)=>setEventId(e.target.value)} value={eventId} className='border'>
//                                         {
//                                             events?.map((e, id) => {
//                                                 return <option value={e.id}>{e.name}</option>
//                                             })
//                                         }
//                                     </select>
//                                 </div>
//                                 <button onClick={handleCreate} className='editButton'>Create</button>
//                             </form>
//                         </div>
//                     </div>
//                 )
//             }
//         </div>
//     )
// }

// export default Banners

import React, { useEffect, useState } from 'react'
import { SummaryApi } from '../../common'
import { MdDeleteForever } from "react-icons/md";
import { RxCross2 } from 'react-icons/rx';

function Banners() {
    const [events, setEvents] = useState([])
    const [banners, setBanners] = useState([])
    const [create, setCreate] = useState({ show: false })
    const [eventId, setEventId] = useState(null)
    const [photo, setPhoto] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents()
            await fetchBanners()
        }
        fetchData()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch(SummaryApi.events.get, { headers: { 'token': localStorage.getItem('token') } })
            const d = await res.json()
            if (res.ok) {
                setEvents(d.data)
            } else {
                console.error(d.message)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }

    const fetchBanners = async () => {
        try {
            const res = await fetch(SummaryApi.banners.get, { headers: { 'token': localStorage.getItem('token') } })
            const d = await res.json()
            if (res.ok) {
                setBanners(d.data.reverse())
            } else {
                console.log(d.message)
            }
        } catch (error) {
            console.error('Error fetching banners:', error)
        }
    }

    const deleteBanner = async (id) => {
        try {
            const res = await fetch(SummaryApi.banners.delete + id, {
                method: 'delete',
                headers: { 'token': localStorage.getItem('token') }
            })
            if (res.ok) {
                setBanners(prevBanners => prevBanners.filter(b => b.id !== id))
            } else {
                const d = await res.json()
                console.log(d.message)
            }
        } catch (error) {
            console.error('Error deleting banner:', error)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const fd = new FormData()
            fd.append('eventId', eventId)
            fd.append('photo', photo)
            const res = await fetch(SummaryApi.banners.post, {
                method: 'post',
                body: fd,
                headers: { 'token': localStorage.getItem('token') }
            })
            const d = await res.json()
            if (res.ok) {
                fetchBanners()
                setCreate({ show: false })
            } else {
                console.log(d.message)
            }
        } catch (error) {
            console.error('Error creating banner:', error)
        }
    }

    const handleChangePhoto = async (e, b) => {
        try {
            const fd = new FormData()
            fd.append('eventId', b.eventId)
            fd.append('photo', e.target.files[0])
            const res = await fetch(SummaryApi.banners.put + b.id, {
                method: 'put',
                body: fd,
                headers: { 'token': localStorage.getItem('token') }
            })
            const d = await res.json()
            if (res.ok) {
                fetchBanners()
            } else {
                console.log(d.message)
            }
        } catch (error) {
            console.error('Error updating banner photo:', error)
        }
    }

    return (
        <div>
            <div className='mb-1 flex justify-between px-4 items-center mt-3 w-full h-14 shadow1 rounded-md'>
                <p className='text-lg'>All banners</p>
                <button onClick={() => setCreate({ show: true })} className='border rounded px-3 bg-slate-100 hover:bg-slate-200'>Create banner</button>
            </div>

            <div className=''>
                {banners.length > 0 ? (
                    banners.map((b) => (
                        <div key={b.id} className='mt-4 p-4 h-[360px] lg:h-[450px] w-full shadow-md rounded-lg'>
                            <label>
                                <div className='w-full h-[90%]'>
                                    <img src={SummaryApi.loadImg.url + b.photo} alt="Banner" className='w-full h-full' />
                                    <input type='file' className='hidden' onChange={(e) => handleChangePhoto(e, b)} />
                                </div>
                            </label>
                            <div className='flex mt-3 items-center gap-12'>
                                <p>Event:</p>
                                <select value={b.eventId} className='border' onChange={(e) => {}}>
                                    {events.map((e) => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                                <div className='w-full'></div>
                                <div onClick={() => deleteBanner(b.id)} className='text-lg rounded-full bg-red-200 hover:bg-red-500 hover:text-white p-1 float-end'><MdDeleteForever /></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No banners available</p>
                )}
            </div>

            {create.show && (
                <div className='z-50 fixed w-full h-full bg-slate-200 bg-opacity-55 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
                    <div className='lg:w-[30%] min-w-[360px] md:w-[60%] sm:w-[60%] h-fit pb-4 bg-white rounded-xl shadow1'>
                        <div className='flex justify-between m-4 items-center text-lg'>
                            <h2 className='font-medium'>Create Banner</h2>
                            <RxCross2 onClick={() => setCreate({ show: false })} />
                        </div>
                        <form className='m-4'>
                            <label>Photo: </label>
                            <input type='file' onChange={(e) => setPhoto(e.target.files[0])} />

                            <div className='flex mt-6 items-center gap-12'>
                                <p>Event:</p>
                                <select onChange={(e) => setEventId(e.target.value)} value={eventId} className='border'>
                                    {events.map((e) => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={handleCreate} className='editButton'>Create</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Banners
