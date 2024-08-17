
import React, { useEffect, useState } from 'react'
import { SummaryApi } from '../../common'
import {MdModeEdit} from 'react-icons/md'
import EditUser from '../../components/admin/EditUser'
import { MdDeleteForever } from "react-icons/md";
import CreateUser from '../../components/admin/CreateUser'
import CreatePlace from '../../components/admin/CreatePlace';
import EditPlace from '../../components/admin/EditPlace';

function Places() {
    const [data, setData] = useState([])
    const [edit,setEdit] = useState({show:false,data:null})
    const [create,setCreate] = useState({show:false})
    const fetchData = async () => {
        const res = await fetch(SummaryApi.places.get, { headers: { 'token': localStorage.getItem('token') } })
        const d = await res.json()
        if (!res.ok) {
            console.log(d.message)
            return
        }
        setData(d.data)
    }
    const deletePlace = async(id)=>{
        //if(!confirm('Delete user?'))return
        const res = await fetch(SummaryApi.places.delete + id,{
            method:'delete',
            headers:{'token':localStorage.getItem('token')},

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
                <p className='text-lg'>All places</p>
                <button onClick={()=>setCreate({show:true})} className='border rounded px-3 bg-slate-100 hover:bg-slate-200'>Create place</button>
            </div>
            {
                data.length !== 0 && (
                    <div className='h-[90%] scrollbar-none'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-black text-white'>
                                    <th className='border-l-2 border-white'>Sr.</th>
                                    <th className='border-l-2 border-white'>Name</th>
                                    <th className='border-l-2 border-white'>Rows</th>
                                    <th className='border-l-2 border-white'>Columns</th>
                                    <th className='border-l-2 border-white'>First row price</th>
                                    <th className='border-l-2 border-white'>Price diff by row</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    data.map((el, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{el?.name}</td>
                                                <td>{el?.rows}</td>
                                                <td>{el?.colums}</td>
                                                <td>{el?.firstRowPrice}</td>
                                                <td>{el?.priceDifByRow}</td>
                                                <td className='flex gap-1'>
                                                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                                        onClick={() => {
                                                            setEdit({show:true,data:el})
                                                        }}
                                                    >
                                                        <MdModeEdit />
                                                    </button>
                                                    <button className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white'
                                                        onClick={() => deletePlace(el.id)}
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
                    <EditPlace place={edit.data} cb={{close:()=>setEdit({show:false}), update:fetchData}}/>
                )
            }
            {
                create.show && (
                    <CreatePlace cb={{close:()=>setCreate({show:false}), update:fetchData}}/>
                )
            }
            </div>
        </div>
    )
}

export default Places