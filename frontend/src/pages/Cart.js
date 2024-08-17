import React, { useEffect, useState } from "react";
import { SummaryApi } from "../common";
import { MdDeleteForever } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

function Cart() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [showPopup, setShowPopup] = useState(false); // State for showing/hiding popup

  const fetchData = async () => {
    const res = await fetch(SummaryApi.carts.url, {
      headers: { token: window.localStorage.getItem("token") },
    });
    const d = await res.json();
    setData(d.data);
    setTotal(d.data.reduce((p, c) => p + c.totalPrice, 0));
  };

  const handleChange = async (cart) => {
    const res = await fetch(SummaryApi.carts.put + cart.id, {
      method: "put",
      headers: {
        "content-type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quantity: cart.quantity,
        rowNumber: cart.rowNumber,
      }),
    });
    const d = await res.json();
    if (!res.ok) {
      console.log(d.message);
      setPopupMessage(d.message); // Show error message in popup
    } else {
      fetchData();
      setTotal((p) => p - cart.totalPrice + d.data.totalPrice);
      setPopupMessage("Cart updated successfully!"); // Show success message in popup
    }
    setShowPopup(true); // Show popup
  };

  const deleteCart = async (cart) => {
    try {
      const res = await fetch(SummaryApi.carts.delete + cart.id, {
        method: "delete",
        headers: { token: localStorage.getItem("token") },
      });
      const d = await res.json();
      if (!res.ok) {
        console.log(d.message);
        setPopupMessage(d.message); // Show error message in popup
      } else {
        setData((prevData) => prevData.filter((item) => item.id !== cart.id));
        setTotal((prevTotal) => prevTotal - cart.totalPrice);
        console.log('Cart item deleted');
        setPopupMessage("Cart item deleted successfully!"); // Show success message in popup
      }
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      setPopupMessage("Failed to delete cart item"); // Show error message in popup
    }
    setShowPopup(true); // Show popup
  };

  const handleBuy = async () => {
    try {
      const res = await fetch(SummaryApi.carts.buy.path, {
        method: SummaryApi.carts.buy.method,
        headers: { token: localStorage.getItem("token") },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ticket.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        fetchData();
        console.log('Ticket downloaded');
        setPopupMessage("Purchase completed successfully!"); // Show success message in popup
      } else {
        const d = await res.json();
        console.log('Error:', d.message);
        setPopupMessage(d.message); // Show error message in popup
      }
    } catch (error) {
      console.error('Failed to complete the purchase:', error);
      setPopupMessage("Failed to complete the purchase"); // Show error message in popup
    }
    setShowPopup(true); // Show popup
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="my-4 mx-6">
      <div className="flex items-center gap-4">
        <div className="w-2 h-8 bg-yellow-500 rounded"></div>
        <h2 className="text-3xl font-semibold py-4 text-blue-900 capitalize">
          Cart
        </h2>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <FaShoppingCart className="text-9xl text-gray-300 animate-bounce" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-600">
            Your cart is empty!
          </h3>
          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => window.location.href = "/events"}
            className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 mt-20 gap-8">
          <div className="m-auto w-[560px] h-fit">
            {data.map((c, id) => (
              <div
                key={id}
                className="px-6 w-full gap-1 items-center h-20 rounded-lg shadow-md flex justify-between bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <p className="text-xl font-medium text-yellow-600">
                  {c.event.name}
                </p>
                <div className="text-lg flex h-10 justify-evenly w-32 rounded-full border-2 border-gray-300 bg-gray-100">
                  <button
                    onClick={() =>
                      handleChange({ ...c, quantity: c.quantity - 1 })
                    }
                    className="cursor-pointer px-3 text-blue-600"
                  >
                    -
                  </button>
                  <p>{c.quantity}</p>
                  <button
                    onClick={() =>
                      handleChange({ ...c, quantity: c.quantity + 1 })
                    }
                    className="cursor-pointer px-3 text-blue-600"
                  >
                    +
                  </button>
                </div>

                <label>
                  <input
                    className="h-10 border-2 border-gray-300 rounded-full w-16 px-4 text-center bg-gray-100"
                    type="number"
                    value={c.rowNumber}
                    onChange={(e) =>
                      handleChange({ ...c, rowNumber: e.target.value })
                    }
                  />
                </label>

                <p className="text-xl font-medium text-blue-700">{c.totalPrice}</p>

                <div className="text-red-600 cursor-pointer hover:text-red-800" onClick={() => deleteCart(c)}>
                  <MdDeleteForever size={24} />
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-8 border-2 text-green-600 border-gray-200 bg-gray-50 rounded-xl shadow-md w-80">
            <h2 className="text-3xl text-gray-700 border-b-2 border-gray-300 pb-4">
              Check Out
            </h2>
            <div className="flex justify-between pt-4">
              <p className="text-xl text-gray-700">Sub Total:</p>
              <p>{total}</p>
            </div>
            <div className="flex justify-between border-b-2 border-gray-300 pb-2">
              <p className="text-xl text-gray-700">Tax:</p>
              <p>5000</p>
            </div>
            <div className="flex justify-between border-b-2 border-gray-300 pb-4">
              <p className="text-xl text-gray-700 pt-4">Total:</p>
              <p>{5000 + total}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleBuy}
                className="mt-8 h-fit text-2xl font-medium rounded-full bg-yellow-500 text-white border-2 border-yellow-500 px-20 py-2 hover:bg-yellow-600 transition-colors duration-200"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Cart;
