import React, { useEffect, useState } from "react";
import { SummaryApi } from "../../common";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [create, setCreate] = useState({ show: false });
  const [edit, setEdit] = useState({ show: false, data: null });

  const fetchContacts = async () => {
    const res = await fetch(SummaryApi.contacts.get, {
      headers: { token: localStorage.getItem("token") },
    });
    const d = await res.json();
    if (!res.ok) {
      return;
    }
    setContacts(d.data);
  };

  const handleCreate = async (e) => {
    const res = await fetch(SummaryApi.contacts.post, {
      method: "post",
      headers: { token: localStorage.getItem("token") },
    });
    const d = await res.json();
    if (!res.ok) {
      console.log(d.message);
      return;
    }
    setCreate({ show: false });
  };

  const deleteContact = async (id) => {
    //if(!confirm('Delete user?'))return
    const res = await fetch(SummaryApi.contacts.delete + id, {
      method: "delete",
      headers: { token: localStorage.getItem("token") },
    });
    const d = await res.json();
    if (!res.ok) {
      console.log(d.message);
      return;
    }
    fetchContacts();
  };
  console.log(contacts);
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <div className="mb-1 flex justify-between px-4 items-center mt-3 w-full h-14 shadow1 rounded-md">
        <p className="text-lg">All contacts</p>
        <button
          onClick={() => setCreate({ show: true })}
          className="border rounded px-3 bg-slate-100 hover:bg-slate-200"
        >
          Create banner
        </button>
      </div>

      <div className="">
        {contacts.length !== 0 &&
          contacts.map((c, id) => {
            return (
              <div className="">
                {contacts.map((c, id) => {
                  return (
                    <div className="w-full flex flex-col gap-3 h-fit m-4 bg-white shadow-md p-4">
                      <div className="">
                        <p>Phone: </p>
                        <p>{c.phone}</p>
                      </div>

                      <div className="">
                        <p>Message: </p>
                        <p className="">{c.message}</p>
                      </div>

                      <div className="">
                        <p>User: </p>
                        <p className="">{c.user.fullname}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Contacts;
