// Register Component
// Same structure as above, just add the loading state and Loading component

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SummaryApi } from '../common';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from '../components/Loading';  // Import the Loading component

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    fullname: ''
  });
  const [loading, setLoading] = useState(false);  // Loading state
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
    setLoading(true);  // Set loading to true
    const res = await fetch(SummaryApi.auth.register.url, {
      method: SummaryApi.auth.register.method,
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    });
    const _data = await res.json();
    console.log(_data);
    setLoading(false);  // Set loading to false after the request is complete

    if (res.ok) {
      localStorage.setItem('email', data.email);
      navigate("/verify");
    } else {
      alert(_data.message);
    }
  };

  return (
    <section id="signup">
      <div className="mx-auto container p-10">
        <div className="bg-white p-8 w-full max-w-sm mx-auto shadow-lg">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="w-20 h-20 mx-auto pt-10 font-bold text-lg leading-4 text-yellow-600">
                <h1>REGISTER</h1>
              </div>

              <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
                <div className="grid">
                  <label>Name : </label>
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      name="fullname"
                      value={data.fullname}
                      onChange={handleChange}
                      required
                      className="w-full h-full outline-none bg-transparent"
                    />
                  </div>
                </div>

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
                  disabled={loading}  // Disable button while loading
                  className={`bg-[#4056A1] hover:bg-[#36458C] text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="mx-auto font-semibold mt-4">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="text-[#4056A1] hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Register;
