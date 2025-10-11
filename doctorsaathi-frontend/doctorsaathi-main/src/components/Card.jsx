import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}
