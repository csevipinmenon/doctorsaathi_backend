import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DoctorSaathiBot from "./ChatBot";
import FloatingContactHub from "./ContactHub";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsUserLoggedIn(!!localStorage.getItem("userAuthToken"));
    setIsDoctorLoggedIn(!!localStorage.getItem("doctorAuthToken"));
  }, []);

  const handleDashboardClick = () => {
    if (isUserLoggedIn) navigate("/user");
    else if (isDoctorLoggedIn) navigate("/doctor");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center h-20 max-w-7xl px-6 md:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="DoctorSaathi Logo"
              className="w-40 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ name, href }) => (
              <Link
                key={name}
                to={href}
                className={`relative font-medium text-gray-700 transition-all duration-300 
                hover:text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 
                after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300
                ${
                  location.pathname === href ? "text-blue-600 after:w-full" : ""
                }`}
              >
                {name}
              </Link>
            ))}

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              {isUserLoggedIn || isDoctorLoggedIn ? (
                <button
                  onClick={handleDashboardClick}
                  className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 bg-white shadow-md ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3 p-5 text-center">
            {NAV_LINKS.map(({ name, href }) => (
              <Link
                key={name}
                to={href}
                onClick={() => setIsOpen(false)}
                className={`block py-3 font-medium rounded-lg hover:bg-blue-50 transition ${
                  location.pathname === href
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {name}
              </Link>
            ))}

            {isUserLoggedIn || isDoctorLoggedIn ? (
              <button
                onClick={() => {
                  handleDashboardClick();
                  setIsOpen(false);
                }}
                className="block py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <DoctorSaathiBot />
      <FloatingContactHub />
    </>
  );
};

export default Navbar;
