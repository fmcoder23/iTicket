import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SummaryApi } from "../common";
import { datHM, dateDM } from "../helpers/date";

function EventPage({ updateCartCount }) { // Accept a prop to update cart count
  const params = useParams();
  const [data, setData] = useState();
  const [inputData, setInputData] = useState({ row: "", quantity: 1 });
  const [price, setPrice] = useState(0); 
  const [priceDiffByRow, setPriceDiffByRow] = useState(0); 
  const [popupMessage, setPopupMessage] = useState(""); 
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (data && inputData.row !== "" && priceDiffByRow > 0) {
      const rowNumber = parseInt(inputData.row, 10);
      const initialPrice = data.place.firstRowPrice;
      const calculatedPrice = initialPrice - (rowNumber - 1) * priceDiffByRow;
      setPrice(calculatedPrice > 0 ? calculatedPrice : 0);
    }
  }, [inputData.row, priceDiffByRow, data]);

  const fetchData = async () => {
    try {
      const res = await fetch(SummaryApi.events.get_by_id + params?.id);
      if (!res.ok) throw new Error("Failed to fetch event data");
      const d = await res.json();
      console.log("Fetched data:", d.data); 
      setData(d.data);
      setPrice(d.data.place.firstRowPrice); 
      setPriceDiffByRow(d.data.place.priceDifByRow); 
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const handleAddToCart = async () => {
    if (inputData.row === "") {
      setPopupMessage("Please enter a row number");
      setShowPopup(true);
      return;
    }
    try {
      const res = await fetch(
        SummaryApi.events.add_to_cart.url +
          params.id +
          SummaryApi.events.add_to_cart.end,
        {
          method: SummaryApi.events.add_to_cart.method,
          headers: {
            "content-type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            quantity: inputData.quantity,
            rowNumber: inputData.row,
          }),
        }
      );

      const d = await res.json();
      if (!res.ok) {
        setPopupMessage(d.message);
      } else {
        setPopupMessage("Successfully added to cart!");
        // updateCartCount(); // Call the function to update the cart count
      }
      setShowPopup(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setPopupMessage("Error adding to cart");
      setShowPopup(true);
    }
  };

  if (!data) {
    return <div className="m-4 mb-20 mx-6">Loading...</div>;
  }

  return (
    <div className="m-4 mb-20 mx-6">
      <div>
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-yellow-500 rounded"></div>
          <h2 className="text-3xl font-semibold py-4 text-blue-900 capitalize">
            {data?.name || "Vaska"}
          </h2>
        </div>

        <div className="grid grid-cols-[1fr_0.7fr] gap-28">
          <div className="mx-16">
            <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src={
                  data?.photo
                    ? `http://localhost:3001/${data.photo}`
                    : "path/to/placeholder.jpg"
                }
                alt={data?.name || "Event Image"}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="mx-10 mt-4 text-xl flex text-gray-700 items-center gap-2">
              <h2 className="font-medium">Address:</h2>
              <p>{data.place.name}</p>
            </div>
            <div className="mx-10 text-xl flex text-gray-700 items-center gap-2">
              <h2 className="font-medium">Time:</h2>
              <p>{dateDM(data.datetime) + ", " + datHM(data.datetime)}</p>
            </div>

            <div className="mx-10 my-4 text-xl text-gray-700">
              <p>{data.description}</p>
            </div>

            <div className="mx-10 text-xl text-gray-700 gap-2">
              <h2 className="font-medium">{data.phone1}</h2>
              <h2 className="font-medium">{data.phone2}</h2>
            </div>
          </div>

          <div className="w-[94%] flex flex-col pt-4 items-center h-96 bg-white shadow-lg rounded-3xl">
            <h2 className="text-4xl text-blue-700 capitalize font-bold mt-8">
              Buy Ticket
            </h2>
            <h2 className="text-2xl mt-8">Buy ticket from:</h2>
            <div className="flex gap-4 mt-4">
              <input
                required
                type="number"
                className="w-44 rounded-full border-2 border-gray-300 px-10"
                placeholder="Row number"
                onChange={(e) =>
                  setInputData((p) => ({ ...p, row: e.target.value }))
                }
                name="row"
                value={inputData.row}
              />
              <div className="text-lg flex justify-evenly w-32 rounded-full border-2 border-gray-300 bg-gray-100">
                <button
                  onClick={() =>
                    setInputData((p) => ({
                      ...p,
                      quantity: Math.max(p.quantity - 1, 1),
                    }))
                  }
                  className="cursor-pointer px-3 text-blue-600"
                >
                  -
                </button>
                <p>{inputData.quantity}</p>
                <button
                  onClick={() =>
                    setInputData((p) => ({ ...p, quantity: p.quantity + 1 }))
                  }
                  className="cursor-pointer px-3 text-blue-600"
                >
                  +
                </button>
              </div>
            </div>
            <h2 className="mt-10 text-3xl font-bold text-yellow-600">
              Price: {price * inputData.quantity}
            </h2>
            <button
              onClick={handleAddToCart}
              className={`mt-4 text-xl font-medium rounded-full ${
                inputData.row === "" ? "bg-gray-400" : "bg-blue-700"
              } text-white border-2 border-blue-700 px-20 py-2 hover:bg-white hover:text-blue-700 transition duration-200`}
              disabled={inputData.row === ""}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <p>{popupMessage}</p>
          <button
            onClick={() => setShowPopup(false)}
            className="mt-2 bg-white text-green-500 px-2 py-1 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default EventPage;
