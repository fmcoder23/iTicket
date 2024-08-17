import React, { useEffect, useState } from 'react'; 
import { SummaryApi } from '../common'; 
import EventCard from '../components/EventCard'; 
 
function Favorite() { 
  const [data, setData] = useState([]); 
 
  const fetchData = async () => { 
    try { 
      const res = await fetch(SummaryApi.favorites.get, { 
        headers: { token: window.localStorage.getItem("token") }, 
      }); 
      const d = await res.json(); 
      setData(d.data); 
      console.log(d.data); 
    } catch (error) { 
      console.error("Failed to fetch favorites", error); 
    } 
  }; 
 
  const removeFav = async (fav) => { 
    try { 
      const res = await fetch(SummaryApi.favorites.delete + fav.id, { 
        method: 'delete', 
        headers: { token: window.localStorage.getItem("token") }, 
      }); 
      const d = await res.json(); 
      fetchData(); 
      console.log(d.data); 
    } catch (error) { 
      console.error("Failed to remove favorite", error); 
    } 
  }; 
 
  useEffect(() => { 
    fetchData(); 
  }, []); 
 
  return ( 
    <div className="my-4 mx-6"> 
      <div className="flex items-center gap-4"> 
        <div className="w-2 h-8 bg-yellow-500"></div> 
        <h2 className="text-3xl font-semibold py-4 text-blue-900 capitalize"> 
          Favorites 
        </h2> 
      </div> 
 
      <div className="mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"> 
        {data.length !== 0 ? ( 
          data.map((ev, id) => ( 
            <div key={ev.event.name + id} className="mx-auto py-4"> 
              <EventCard 
                cb={{ update: fetchData, rem: () => removeFav(ev) }} // Wrap removeFav in a function
                event={ev.event} 
                isFav={true} 
              /> 
            </div> 
          )) 
        ) : ( 
          <p className="text-center text-gray-500">No favorites yet.</p> 
        )} 
      </div> 
    </div> 
  ); 
} 
 
export default Favorite;