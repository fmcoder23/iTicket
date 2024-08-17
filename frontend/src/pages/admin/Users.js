
import React, { useEffect, useState } from 'react'
import { SummaryApi } from '../../common'
import {MdModeEdit} from 'react-icons/md'
import EditUser from '../../components/admin/EditUser'
import { MdDeleteForever } from "react-icons/md";
import CreateUser from '../../components/admin/CreateUser'

function Users() {
    const [data, setData] = useState([])
    const [edit,setEdit] = useState({show:false,data:null})
    const [create,setCreate] = useState({show:false})
    const fetchData = async () => {
        const res = await fetch(SummaryApi.users.get, { headers: { 'token': localStorage.getItem('token') } })
        const d = await res.json()
        if (!res.ok) {
            console.log(d.message)
            return
        }
        setData(d.data)
    }
    const deleteUser = async(id)=>{
        //if(!confirm('Delete user?'))return
        const res = await fetch(SummaryApi.users.delete + id,{
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
                <p className='text-lg'>All user</p>
                <button onClick={()=>setCreate({show:true})} className='border rounded px-3 bg-slate-100 hover:bg-slate-200'>Create user</button>
            </div>
            {
                data.length !== 0 && (
                    <div className='h-[90%] scrollbar-none'>
                        <table className='w-full'>
                            <thead>
                                <tr className='bg-black text-white'>
                                    <th className='border-l-2 border-white'>Sr.</th>
                                    <th className='border-l-2 border-white'>Name</th>
                                    <th className='border-l-2 border-white'>Email</th>
                                    <th className='border-l-2 border-white'>Role</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {
                                    data.map((el, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{el?.fullname}</td>
                                                <td>{el?.email}</td>
                                                <td>{el?.isAdmin ? "Admin" : "General"}</td>
                                                
                                                <td className='flex gap-1'>
                                                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                                        onClick={() => {
                                                            setEdit({show:true,data:el})
                                                        }}
                                                    >
                                                        <MdModeEdit />
                                                    </button>
                                                    <button className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white'
                                                        onClick={() => deleteUser(el.id)}
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
                    <EditUser user={edit.data} cb={{close:()=>setEdit({show:false}), update:fetchData}}/>
                )
            }
            {
                create.show && (
                    <CreateUser cb={{close:()=>setCreate({show:false}), update:fetchData}}/>
                )
            }
            </div>
        </div>
    )
}

export default Users