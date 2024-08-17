
import React, { useEffect, useState } from 'react'
import { SummaryApi } from '../../common'
import { MdModeEdit } from 'react-icons/md'
import { MdDeleteForever } from "react-icons/md";
import { IoArrowRedoSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { dateDM } from '../../helpers/date';
import EditCategory from '../../components/admin/EditCategory';
import CreateCategory from '../../components/admin/CreateCategory';


function Categories() {
    const [data, setData] = useState([])
    const [edit, setEdit] = useState({ show: false, data: null })
    const [create, setCreate] = useState({ show: false })
    const fetchData = async () => {
        const res = await fetch(SummaryApi.categories.get, { headers: { 'token': localStorage.getItem('token') } })
        const d = await res.json()
        if (!res.ok) {
            console.log(d.message)
            return
        }
        setData(d.data)
    }
    const deleteCategory = async (id) => {
        //if(!confirm('Delete user?'))return
        const res = await fetch(SummaryApi.categories.delete + id, {
            method: 'delete',
            headers: { 'token': localStorage.getItem('token') },

        })
        const d = await res.json()
        if (!res.ok) {
            console.log(d.message)
            return
        }
        fetchData()
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div>
            <div className='mb-1 flex justify-between px-4 items-center mt-3 w-full h-14 shadow1 rounded-md'>
                <p className='text-lg'>All categories</p>
                <button onClick={() => setCreate({ show: true })} className='border rounded px-3 bg-slate-100 hover:bg-slate-200'>Create category</button>
            </div>
            {
                data.length !== 0 && (
                    <div className='h-[90%] scrollbar-none'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-black  text-white'>
                                    <th className='border-l-2 border-white'>Sr.</th>
                                    <th className='border-l-2 border-white'>Name</th>
                                    <th className='border-l-2 border-white'>Created at</th>
                                    <th className='border-l-2 border-white'>Updated at</th>
                                    <th className='border-l-2 border-white'>Events</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    data.map((el, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{el?.name}</td>
                                                <td>{dateDM(el?.createdAt)}</td>
                                                <td className=''>{dateDM(el?.updatedAt)}</td>
                                                <td className='flex justify-center'>
                                                    {
                                                        el.events.length !== 0 ? (
                                                            <div className='ml-6 w-fit scale-x-150'>
                                                                <Link ><IoArrowRedoSharp /></Link>
                                                            </div>
                                                        ) : (
                                                            <p>No events</p>
                                                        )
                                                    }
                                                </td>
                                                <td></td>
                                                <td className='flex gap-1'>
                                                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                                        onClick={() => {
                                                            setEdit({ show: true, data: el })
                                                        }}
                                                    >
                                                        <MdModeEdit />
                                                    </button>
                                                    <button className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white'
                                                        onClick={() => deleteCategory(el.id)}
                                                    >
                                                        <MdDeleteForever />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
            <div>
                {
                    edit.show && (
                        <EditCategory category={edit.data} cb={{ close: () => setEdit({ show: false }), update: fetchData }} />
                    )
                }
                {
                    create.show && (
                        <CreateCategory cb={{ close: () => setCreate({ show: false }), update: fetchData }} />
                    )
                }

            </div>
        </div>
    )
}

export default Categories