import React from "react";
import { useState } from "react";

import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaAngleUp,
  FaHeadset,
} from "react-icons/fa";

export default function FloatingContactHub() {
  const [isOpen, setIsOpen] = useState(false);

  const CONTACT_LINKS = [
    {
      icon: <FaPhoneAlt className="w-5 h-5" />,
      label: "Call Us",
      link: "tel:+917209658250",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      icon: <FaWhatsapp className="w-5 h-5" />,
      label: "WhatsApp",
      link: "https://wa.me/919565264562",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "Email",
      link: "mailto:team.servana@gmail.com",
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  ];

  return (
    <div className="fixed bottom-6 right-24 z-40 flex flex-col items-end">
      {/* Animated Contact Links */}
      <style>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.4);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out;
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeInUP {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUP 0.5s ease-out;
        }
      `}</style>

      <div
        className={`space-y-3 mb-3 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {CONTACT_LINKS.map((item, index) => (
          <a
            key={item.label}
            href={item.link}
            target={item.label === "Email" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className={`flex items-center p-3 rounded-full text-white shadow-lg ${item.bgColor} ${item.hoverColor} transition-all duration-200 transform hover:scale-105`}
            style={{
              // Staggered animation
              transitionDelay: isOpen
                ? `${(CONTACT_LINKS.length - 1 - index) * 0.08}s`
                : "0s",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateX(0)" : "translateX(10px)",
            }}
          >
            {item.icon}
            <span className="ml-3 font-semibold text-sm w-20 text-left">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        className={`p-4 rounded-full text-white shadow-xl cursor-pointer transition-all duration-300 ease-in-out ${
          isOpen
            ? "bg-emerald-600 hover:bg-emerald-700 rotate-180"
            : "bg-emerald-500 hover:bg-emerald-600 animate-pulse-slow"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Contact Options" : "Open Contact Options"}
      >
        {isOpen ? (
          <FaAngleUp className="w-6 h-6" />
        ) : (
          <FaHeadset className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
