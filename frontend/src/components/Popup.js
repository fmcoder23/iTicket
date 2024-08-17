import React, { useEffect } from 'react';

function Popup({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Automatically close the popup after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-[#EFE2BA] text-black'
      }`}
      style={{ zIndex: 1000 }} // Ensure popup is on top of other elements
    >
      <p>{message}</p>
      <button
        onClick={onClose}
        className={`mt-2 px-2 py-1 rounded ${
          type === 'error' ? 'bg-white text-red-500' : 'bg-black text-white'
        }`}
      >
        Close
      </button>
    </div>
  );
}

export default Popup;
