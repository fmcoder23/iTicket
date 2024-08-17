import React, { useEffect, useState } from 'react';
import { SummaryApi } from '../../common';
import { useLocation } from 'react-router-dom';
import EventCard from '../../components/EventCard';
import AdminEventCard from '../../components/admin/AdminEventCard';
import EditEvent from '../../components/admin/EditEvent';
import CreateEvent from '../../components/admin/CreateEvent';

function Event() {
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState({ show: false, data: null });
    const [create, setCreate] = useState({ show: false });
    const [places, setPlaces] = useState([]);
    const [dates, setDtaes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search).get('category');
    console.log(params);
    const [filter, setFilter] = useState({ place: '', date: '', category: params || '' });

    const fetchFilterData = async () => {
        try {
            let res = await fetch(SummaryApi.places.get);
            let d = await res.json();
            setPlaces(d.data);

            res = await fetch(SummaryApi.categories.get);
            d = await res.json();
            setCategories(d.data);
        } catch (error) {
            console.error('Error fetching filter data:', error);
        }
    };

    const fetchData = async () => {
        try {
            const res = await fetch(SummaryApi.events.get, { headers: { 'token': localStorage.getItem('token') } });
            const d = await res.json();
            if (!res.ok) {
                console.log(d.message);
                return;
            }
            setData(d.data);
        } catch (error) {
            console.error('Error fetching event data:', error);
        }
    };

    const handleFilter = (e) => {
        const { name, value } = e.target;
        setFilter((p) => ({
            ...p,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchFilterData();
    }, []);

    useEffect(() => {
        const filteredEvents = data
            .filter((e) => e.place.name === filter.place || filter.place === '')
            .filter((e) => e.category.name === filter.category || filter.category === '');
        setFiltered(filteredEvents);
    }, [data, filter]);

    const deleteEvent = async (id) => {
        if (!window.confirm('Delete event?')) return;
        try {
            const res = await fetch(SummaryApi.events.delete + id, {
                method: 'DELETE',
                headers: { 'token': localStorage.getItem('token') },
            });
            const d = await res.json();
            if (!res.ok) {
                console.log(d.message);
                return;
            }
            fetchData();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className='mb-1 flex justify-between px-4 items-center mt-3 w-full h-14 shadow1 rounded-md'>
                <p className='text-lg'>All events</p>
                <button onClick={() => setCreate({ show: true })} className='border rounded px-3 bg-slate-100 hover:bg-slate-200'>Create event</button>
            </div>

            {/*** filter */}
            <div className='flex items-center m-4 gap-8'>
                <p className='text-gray-600 font-medium text-xl'>Filter by:</p>
                <select name='place' value={filter.place} onChange={handleFilter} className='h-10 px-6 font-bold text-slate-500 rounded-md shadow-[0px_3px_8px_rgba(0,0,0,.4)] text-lg'>
                    <option value={''}>Place</option>
                    {
                        places.length !== 0 && (
                            places.map((pl, id) => {
                                return <option value={pl.name} key={pl.name + id}>{pl.name}</option>;
                            })
                        )
                    }
                </select>
                <select name='date' value={filter.date} onChange={handleFilter} className='h-10 px-6 font-bold text-slate-500 rounded-md shadow-[0px_3px_8px_rgba(0,0,0,.4)] text-lg'>
                    <option value={''}>Date</option>
                    {
                        // Optionally, map dates here
                    }
                </select>
                <select name='category' value={filter.category} onChange={handleFilter} className='h-10 px-6 font-bold text-slate-500 rounded-md shadow-[0px_3px_8px_rgba(0,0,0,.4)] text-lg'>
                    <option value={''}>Category</option>
                    {
                        categories.length !== 0 && (
                            categories.map((ct, id) => {
                                return <option value={ct.name} key={ct.name + id}>{ct.name}</option>;
                            })
                        )
                    }
                </select>
            </div>

            {/*** cards */}
            <div className='mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
                {
                    filtered.length !== 0 ? (
                        filtered.map((ev, id) => (
                            <div className='mx-auto py-4' key={ev.name + id}>
                                <AdminEventCard cb={{ edit: (e) => { setEdit({ data: e, show: true }); }, delete: (e) => deleteEvent(e) }} event={ev} />
                            </div>
                        ))
                    ) : (<></>)
                }
            </div>
            {
                edit.show && (
                    <EditEvent event={edit.data} categories={categories} places={places} cb={{ close: () => setEdit({ show: false }), update: fetchData }} />
                )
            }
            {
                create.show && (
                    <CreateEvent categories={categories} places={places} cb={{ close: () => setCreate({ show: false }), update: fetchData }} />
                )
            }
        </div>
    );
}

export default Event;
