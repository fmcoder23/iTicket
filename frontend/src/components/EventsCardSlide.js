import React, { useEffect, useRef, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import EventCard from './EventCard'
import { SummaryApi } from '../common'

function EventsCardSlide({ category, heading }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const scrollElement = useRef()

    // Define loadingList to display skeleton loaders while data is being fetched
    const loadingList = new Array(13).fill(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const requests = category.events.map(event =>
                fetch(SummaryApi.events.get_by_id + event.id).then(res => res.json())
            )
            const results = await Promise.all(requests)
            const _data = results.map(r => r.data)
            setData(_data)
        } catch (error) {
            console.error('Error fetching events:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const scrollRight = () => {
        scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
    const scrollLeft = () => {
        scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' })
    }

    return (
        <div className='container mx-auto px-4 py-4 my-6 relative'>
            <div className='flex items-center gap-4'>
                <div className='w-2 h-8 bg-yellow-500'></div>
                <h2 className='text-3xl font-semibold py-4 text-blue-900'>{heading}</h2>
            </div>

            <div className='p-4 flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>
                <button className='absolute left-0 rounded-full bg-slate-200 p-1 z-10' onClick={scrollLeft}><FaAngleLeft /></button>
                <button className='absolute right-0 rounded-full bg-slate-200 p-1 z-10' onClick={scrollRight}><FaAngleRight /></button>

                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className="w-96 h-[480px] rounded-2xl bg-gray-200 animate-pulse"></div>
                    ))
                ) : (
                    data.map((event, id) => (
                        <EventCard 
                            key={id} 
                            event={event} 
                            cb={{ update: fetchData }}  // Pass the cb prop here
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default EventsCardSlide
