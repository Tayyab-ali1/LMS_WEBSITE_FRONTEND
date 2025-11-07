import React, { use, useState } from "react";
import logo from "../assets/lhlogo.png";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userslice";
import { toast } from "react-toastify";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Naav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showHam, setShowHam] = useState(false);
  

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/user/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logout successful");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="  w-full h-[80px] fixed top-0 px-4 md:px-10 flex items-center justify-between bg-gray-200 text-black shadow-md z-20">
      {/* Logo */}
      <div
        className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Logo"
          className="h-12 w-12 rounded-full border-2 border-gray-400 transition-transform duration-300 hover:scale-110 hover:rotate-6"
        />
        <span className="text-xl font-bold tracking-wide hidden md:inline">
          LearningHub
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center space-x-6">
        {/* Educator Dashboard */}
        {userData?.user?.role === "educator" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-7 py-3 text-base font-medium rounded-md border border-black bg-black text-gray-200 
                       hover:bg-gray-300 hover:text-black transition-all duration-300 shadow-md cursor-pointer"
          >
            Dashboard
          </button>
        )}

        {/* User Avatar + Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          >
            {!userData ? (
              <IoPersonCircleSharp className="h-10 w-10 text-gray-600 hover:text-black transition-colors" />
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg
               font-semibold bg-black text-gray-200
               border border-gray-600 shadow-md">
                {userData?.user?.photoUrl ? <img  src={userData?.user?.photoUrl} className="h-10 w-10 rounded-full flex items-center 
                justify-center text-lg
               font-semibold bg-black text-gray-200
               border border-gray-600 shadow-md"  onClick={() => setShow((prev) => !prev)} />: userData?.user?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span className="hidden md:inline text-sm font-medium">
              {userData ? userData.user.name : "Guest"}
            </span>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {show && userData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 mt-2 w-52 bg-gray-100 rounded-md shadow-lg py-2 z-30 border border-gray-300"
              >
                <span
                  onClick={() => {
                    navigate("/profile");
                    setShow(false);
                  }}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-300 cursor-pointer" 
                >
                  My Profile
                </span>
                <span
                  onClick={() => {
                    navigate("/courses");
                    setShow(false);
                  }}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-300 cursor-pointer"  >
                  My Courses
                </span>
                <div className="border-t border-gray-300 my-1"></div>
                <span
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-300 cursor-pointer flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Login / Logout */}
        {!userData ? (
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 text-base font-medium rounded-md border border-black bg-black text-gray-200 
                       hover:bg-gray-300 hover:text-black transition-all duration-300 shadow-md"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-7 py-3 text-base font-medium rounded-md border border-black bg-black text-gray-200 
                       hover:bg-gray-300 hover:text-black transition-all duration-300 shadow-md"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setShowHam(!showHam)}
          className="text-black focus:outline-none p-2"
        >
          <RxHamburgerMenu className="h-8 w-8" />
        </button>
      </div>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {showHam && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-[80px] left-0 w-3/4 max-w-sm h-screen bg-gray-100 shadow-xl lg:hidden z-40 p-6 flex flex-col space-y-4 border-r border-gray-300"
          >
            {userData?.user?.role === "educator" && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setShowHam(false);
                }}
                className="w-full py-3 rounded-md border border-black bg-black text-gray-200 
                           hover:bg-gray-300 hover:text-black transition-all cursor-pointer"
              >
                Dashboard
              </button>
            )}

            {userData && (
              <>
                <span
                  onClick={() => {
                    navigate("/profile");
                    setShowHam(false);
                  }}
                  className="w-full py-3 rounded-md text-center text-black hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  My Profile
                </span>
                <span
                  onClick={() => {
                    navigate("/courses");
                    setShowHam(false);
                  }}
                  className="w-full py-3 rounded-md text-center text-black hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  My Courses
                </span>
              </>
            )}

            {!userData ? (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowHam(false);
                }}
                className="w-full py-3 rounded-md border border-black bg-black text-gray-200 
                           hover:bg-gray-300 hover:text-black transition-all"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setShowHam(false);
                }}
                className="w-full py-3 rounded-md border border-black bg-black text-gray-200 
                           hover:bg-gray-300 hover:text-black transition-all"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Naav;
