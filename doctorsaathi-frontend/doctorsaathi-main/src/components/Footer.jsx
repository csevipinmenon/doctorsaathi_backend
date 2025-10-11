import React from "react";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 mt-auto border-t border-gray-700">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Left Section - Logo & About */}
        <div className="text-center md:text-left space-y-4">
          <a
            href="/"
            className="flex items-center justify-center md:justify-start space-x-2"
          >
            <img
              src="/logo.png"
              alt="DoctorSaathi"
              className="w-40 object-contain"
            />
          </a>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
            Connecting patients with trusted healthcare professionals. Reliable,
            accessible, and compassionate care at your fingertips.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="text-center md:text-left space-y-4">
          <h2 className="text-lg font-semibold text-emerald-500 tracking-wide">
            Quick Links
          </h2>
          <div className="flex flex-col space-y-2 text-gray-300">
            <a href="/" className="hover:text-emerald-500 transition">
              Home
            </a>
            <a href="/about" className="hover:text-emerald-500 transition">
              About
            </a>
            <a href="/contact" className="hover:text-emerald-500 transition">
              Contact
            </a>
            <a href="/faqs" className="hover:text-emerald-500 transition">
              FAQs
            </a>
            <a
              href="/privacy"
              className="hover:text-emerald-500 transition"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Right Section - Contact Info */}
        <div className="text-center md:text-left space-y-4">
          <h2 className="text-lg font-semibold text-emerald-500 tracking-wide">
            Contact Us
          </h2>
          <div className="flex justify-center md:justify-start space-x-5 text-gray-300">
            <a
              href="https://wa.me/+917209658250"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="w-6 h-6 hover:text-emerald-500 transition-transform transform hover:scale-110" />
            </a>
            <a href="mailto:team.servana@gmail.com" title="Send Email">
              <FaEnvelope className="w-6 h-6 hover:text-emerald-500 transition-transform transform hover:scale-110" />
            </a>
            <a href="tel:+917209658250" title="Call Us">
              <FaPhone className="w-6 h-6 hover:text-emerald-500 transition-transform transform hover:scale-110" />
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Email:{" "}
            <a
              href="mailto:team.servana@gmail.com"
              className="text-emerald-500 hover:underline"
            >
              team.servana@gmail.com
            </a>
          </p>
          <p className="text-gray-400 text-sm">
            Helpline:{" "}
            <a
              href="tel:+917209658250"
              className="text-emerald-500 hover:underline"
            >
              +91 72096 58250
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-emerald-500 font-medium">DoctorSaathi</span>. All
        Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
