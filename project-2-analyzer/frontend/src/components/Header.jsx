import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useUserContext } from "../context/UserContext"; // Adjust the import path as necessary
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Using icons for user and menu

const NavBar = () => {
  const { user, logoutUser } = useUserContext();
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu
  const location = useLocation(); // Get current route

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-red-500 to-pink-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-3xl md:text-4xl font-bold tracking-wide hover:opacity-90 transition-opacity duration-300"
        >
          Data Visualization Dashboard
        </Link>

        {/* Hamburger Icon (visible on small screens) */}
        <div className="md:hidden flex items-center" onClick={toggleMenu}>
          {isOpen ? (
            <FaTimes className="text-white text-3xl cursor-pointer" />
          ) : (
            <FaBars className="text-white text-3xl cursor-pointer" />
          )}
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              {/* User Info */}
              <div className="flex items-center text-white">
                <FaUserCircle className="mr-2 text-3xl" />
                <span className="font-medium text-lg">Hi, {user.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logoutUser}
                className="bg-white text-red-500 font-medium py-2 px-5 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Register Button */}
              <Link
                to="/register"
                className={`${
                  location.pathname === "/register"
                    ? "bg-white text-red-500"
                    : "text-white"
                } font-medium py-2 px-5 rounded-full shadow-md transition-transform transform hover:scale-105 duration-300`}
              >
                Register
              </Link>

              {/* Login Link */}
              <Link
                to="/login"
                className={`${
                  location.pathname === "/login"
                    ? "bg-white text-red-500"
                    : "text-white"
                } font-medium py-2 px-5 rounded-full shadow-md  transition-transform transform hover:scale-105 duration-300`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu (visible on small screens) */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden flex flex-col items-center mt-4 space-y-4`}
      >
        {user ? (
          <>
            <div className="flex items-center text-white">
              <FaUserCircle className="mr-2 text-3xl" />
              <span className="font-medium text-lg">Hi, {user.name}</span>
            </div>

            <button
              onClick={logoutUser}
              className="bg-white text-red-500 font-medium py-2 px-5 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={`${
                location.pathname === "/register"
                  ? "bg-white text-red-500"
                  : "text-white"
              } font-medium py-2 px-5 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300`}
            >
              Register
            </Link>

            <Link
              to="/login"
              className={`${
                location.pathname === "/login"
                  ? "bg-white text-red-500"
                  : "text-white"
              } font-medium py-2 px-5 rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300`}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
