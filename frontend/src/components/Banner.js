import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { SummaryApi } from "../common";
import Loading from '../components/Loading'; // Import the Loading component

function Banner() {
  const [currentImg, setCurrentImg] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchBanners = async () => {
    try {
      const res = await fetch(SummaryApi.banners.get);
      const _data = await res.json();
      if (res.ok) {
        setData(_data.data);
        console.log(_data);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const interval = setInterval(() => {
        setCurrentImg((prevImg) => (prevImg + 1) % data.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data]);

  return (
    <div className="px-2 mx-auto container rounded">
      <div className="h-[560px] w-full bg-slate-200 relative">
        {loading ? (
          <Loading /> // Show loading indicator while loading is true
        ) : (
          <>
            <div className="absolute z-10 h-full w-full flex items-center">
              <div className="flex justify-between w-full text-2xl">
                <button
                  className="bg-white rounded-full p-1"
                  onClick={() =>
                    setCurrentImg((prevImg) =>
                      prevImg > 0 ? prevImg - 1 : data.length - 1
                    )
                  }
                >
                  <FaAngleLeft />
                </button>
                <button
                  className="bg-white rounded-full p-1"
                  onClick={() =>
                    setCurrentImg((prevImg) => (prevImg + 1) % data.length)
                  }
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
            <div className="flex w-full h-full overflow-hidden">
              {data.map((banner, id) => (
                <div
                  className="w-full h-full min-w-full transition-transform"
                  key={banner.photo + id}
                  style={{ transform: `translateX(-${currentImg * 100}%)` }}
                >
                  <img
                    src={`http://localhost:3001/${banner.photo}`}
                    className="w-full h-full object-cover"
                    alt={`Banner ${id + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Banner;
