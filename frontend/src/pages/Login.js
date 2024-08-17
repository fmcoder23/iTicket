import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SummaryApi } from '../common';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from '../components/Loading';  // Import the Loading component

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
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
    const res = await fetch(SummaryApi.auth.login.url, { 
      method: SummaryApi.auth.login.method, 
      body: JSON.stringify(data), 
      headers: { 'content-type': 'application/json' } 
    });
    const _data = await res.json();
    console.log(res);
    setLoading(false);  // Set loading to false after the request is complete

    if (_data.token) {
      localStorage.setItem('token', _data.token);
      localStorage.setItem('userId', _data.user.id);
      navigate("/");
    } else {
      alert(_data.message);
      setData({ email: '', password: '' });
    }
  };

  return (
    <section id="login">
      <div className="mx-auto container p-10">
        <div className="bg-white p-8 w-full max-w-sm mx-auto shadow-lg">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="w-20 h-20 mx-auto pt-10 font-bold text-lg leading-4 text-yellow-600">
                <h1>LOGIN</h1>
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
                      className="w-full h-full outline-none bg-transparent"
                      required
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
                      className="w-full h-full outline-none bg-transparent"
                      required
                    />
                    <div
                      className="cursor-pointer text-xl"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="bg-[#4056A1] hover:bg-[#36458C] text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4"
                  type="submit"
                >
                  Login
                </button>

                <div className="mx-auto font-semibold mt-4">
                  New User?{" "}
                  <Link
                    to={"/register"}
                    className="text-[#4056A1] hover:underline"
                  >
                    Register
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

export default Login;
