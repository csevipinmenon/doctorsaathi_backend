import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const Notification = ({ message, type = "success", onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`fixed left-1/2 top-6 transform -translate-x-1/2 p-4 rounded-lg border shadow-lg z-50 transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      } ${bgColor}`}
      style={{ minWidth: "320px", maxWidth: "90vw" }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        <X
          className="w-4 h-4 ml-4 cursor-pointer hover:text-gray-500 transition"
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
        />
      </div>
    </div>
  );
};

export default Notification;
