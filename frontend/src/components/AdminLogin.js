import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SummaryApi } from '../common';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [wait, setWait] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWait(true);

    try {
      const res = await fetch(SummaryApi.auth.admin_login.url, {
        method: SummaryApi.auth.admin_login.method,
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
      });
      const _data = await res.json();

      console.log(_data);

      if (res.ok) {
        // Store the token and user ID
        localStorage.setItem('token', _data.token);
        localStorage.setItem('userId', _data.userId);
        setPopupMessage("Admin logged in successfully!");
        setPopupType("success");

        setShowPopup(false);
        navigate("/admin");

      } else {
        setPopupMessage(_data.message || "Login failed!");
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      setPopupMessage('An error occurred during admin login. Please try again.');
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setWait(false);
    }
  };

  return (
    <section id="admin-login">
      <div className="mx-auto container p-10">
        <div className="bg-white p-8 w-full max-w-sm mx-auto shadow-lg">
          <div className="w-30 h-20 mx-auto pt-10 font-bold text-lg leading-4 text-yellow-600">
            <h1 className='text-center'>ADMIN LOGIN</h1>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Email : </label>
              <div className="bg-slate-100 p-2 rounded-lg">
                <input
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label>Password : </label>
              <div className="bg-slate-100 p-2 flex items-center justify-between rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={data.password}
                  name="password"
                  onChange={handleChange}
                  required
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={wait}
              className={`bg-[#4056A1] hover:bg-[#36458C] text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4 ${wait ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {wait ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div
          className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-lg ${popupType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          <p>{popupMessage}</p>
          <button
            onClick={() => setShowPopup(false)}
            className="mt-2 bg-white text-green-500 px-2 py-1 rounded"
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}

export default AdminLogin;
