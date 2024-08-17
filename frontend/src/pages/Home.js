import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import { useNavigate } from 'react-router-dom'
import { SummaryApi } from '../common'
import EventsCardSlide from '../components/EventsCardSlide'

function Home() {
  const token = window.localStorage.getItem("token")

  const navigate = useNavigate()
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [token])

  const [data, setData] = useState([])
  const fetchData = async()=>{
    const res = await fetch(SummaryApi.categories.get,{method:'get'})
    const _data = await res.json()
    setData(_data.data)
    console.log(_data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Banner />
      {data.length !== 0 && 
        data.map((category,id)=>{
          if(category.events.length)return (
          <div key={id} >
            <EventsCardSlide category={category} heading={category.name}/>
          </div>
        )})
      }
      
    </div>
  )
}

export default Home