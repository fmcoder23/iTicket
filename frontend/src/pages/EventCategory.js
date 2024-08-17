import React, { useEffect, useState } from 'react'
import { SummaryApi } from '../common'
import EventCard from '../components/EventCard'
import { useLoaderData, useLocation, useSearchParams } from 'react-router-dom'

function EventCategoryPage() {

  const [places, setPlaces] = useState([])
  const [dates, setDtaes] = useState([])
  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const location = useLocation()
  const params = new URLSearchParams(location.search).get('category')
  console.log(params)
  const [filter, setFilter] = useState({ place: '', date: '', category: params || '' })


  const [fav,setFav]=useState([])
  const fetchFav = async () => {
    const res = await fetch(SummaryApi.favorites.get, {
      headers: { token: window.localStorage.getItem("token") },
    });
    const d = await res.json();
    setFav(d.data);
    console.log(d.data);
  };

  const fetchFilterData = async () => {
    let res = await fetch(SummaryApi.places.get)
    let d = await res.json()
    setPlaces(d.data)
    res = await fetch(SummaryApi.categories.get)
    d = await res.json()
    setCategories(d.data)
  }

  const fetchEvents = async () => {
    const res = await fetch(SummaryApi.events.get)
    const d = await res.json()
    setEvents(d.data)
  }

  const handleFilter = (e) => {
    const { name, value } = e.target
    setFilter(p=>{
      return{
        ...p,
        [name] : value
      }
    })
    
  }
  console.log(filtered)
  useEffect(() => {
    fetchFilterData()
    
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchFav()
  }, [])

  useEffect(() => {
    const fe = events.filter(e=>e.place.name == filter.place || filter.place == '').filter(e=>e.category.name == filter.category || filter.category == '')
    setFiltered(fe)
  },[events,filter])

  return (
    <div className='overflow-hidden'>
      <div className='m-14'>
        <div className='flex items-center gap-4'>
          <div className='w-2 h-8 bg-yellow-500'></div>
          <h2 className='text-3xl font-semibold py-4 text-blue-900 capitalize'>All Events</h2>
        </div>

        {/*** filter */}
        <div className='flex items-center m-4 gap-8'>
          <p className='text-gray-600 font-medium text-xl'>Filter by:</p>
          <select name='place' value={filter.place} onChange={handleFilter} className='h-10 px-6 font-bold text-slate-500 rounded-md shadow-[0px_3px_8px_rgba(0,0,0,.4)] text-lg'>
            <option value={''}>Place</option>
            {
              places.length !==0 && (
                places.map((pl,id)=>{
                  return <option value={pl.name} key={pl.name+id} >{pl.name}</option>
                })
              )
            }
          </select>
          <select name='date' value={filter.date} onChange={handleFilter} className='h-10 px-6 font-bold text-slate-500 rounded-md shadow-[0px_3px_8px_rgba(0,0,0,.4)] text-lg'>
            <option value={''}>Date</option>
            {
              
            }
          </select>
          <select name='category' value={filter.category} onChange={handleFilter} className='h-10 px-6 font-bold text-slate-500 rounded-md shadow-[0px_3px_8px_rgba(0,0,0,.4)] text-lg'>
            <option value={''}>Category</option>
            {
              categories.length !==0 && (
                categories.map((ct,id)=>{
                  return <option value={ct.name} key={ct.name+id} >{ct.name}</option>
                })
              )
            }
          </select>

        </div>

        {/***cards */}
        <div className='mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
          {
            filtered.length !==0 ?(
              filtered.map((ev,id)=>{
                return <div className='mx-auto py-4'>
                  <EventCard cb={{update:fetchEvents}} isFav={true}  key={ev.name+id} event={ev}/>
                </div>
              })
            ):(<></>)
          }
        </div>
      </div>
    </div>
  )
}

export default EventCategoryPage