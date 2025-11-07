import React, { useState } from "react";
import logo from "../assets/lhlogo.png";
import google from "../assets/google.jpg";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userslice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { FaArrowLeftLong } from "react-icons/fa6";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Normal login
const handleLogin = async (e) => {
  e.preventDefault();
  setErrors([]);

  if (!email || !password) {
    setErrors(["Please enter both email and password"]);
    return;
  }

  setLoading(true);
  try {
    const result = await axios.post(
      serverUrl + "/api/user/login",
      { email, password },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data));
    toast.success("Login successful");

    // ✅ navigate properly (no reload)
    navigate("/", { replace: true });
    window.location.reload()
  } catch (error) {
    console.error(error);
    const backendErrors =
      error?.response?.data?.errors ||
      [error?.response?.data?.message || "Login failed"];
    setErrors(backendErrors);
    toast.error(backendErrors[0]);
  } finally {
    setLoading(false);
  }
};

// ✅ Google login
const googleloginhandler = async () => {
  try {
    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    const result = await axios.post(
      `${serverUrl}/api/user/google`,
      { name: user.displayName, email: user.email },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data));
    toast.success("Google login successful");

    // ✅ navigate properly (no reload)
    navigate("/", { replace: true });
    window.location.reload()
  } catch (error) {
    console.error("Google Auth Error:", error);
    toast.error(
      error.code === "auth/popup-blocked"
        ? "Please enable popups to login with Google"
        : "Google login failed"
    );
  }
};
  return (
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center ">
 
      <form
        className="w-[90%] md:w-[800px] h-[650px] bg-white shadow-xl rounded-2xl flex relative"
        onSubmit={handleLogin}
      >
         < FaArrowLeftLong className='absolute top-[3%] md:top-[16%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>

       
        {/* Left Section */}
        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center gap-3 px-4 pb-16">
          <div className="text-center mb-2">
            <h1 className="font-semibold text-black text-2xl">Welcome Back</h1>
            <h2 className="text-[#999797] text-lg">Login to your account</h2>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 w-[80%]">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border w-full h-[35px] border-[#e7e6e6] text-sm px-4 rounded"
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 w-[80%]">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border w-full h-[35px] border-[#e7e6e6] text-sm px-4 rounded"
              placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-md disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <ClipLoader size={24} color="white" /> : "Login"}
          </button>

          <span
            className="text-[13px] cursor-pointer text-[#585757]"
            onClick={() => navigate("/forget")}
          >
            Forgot password?
          </span>

          {/* Divider */}
          <div className="w-[80%] flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-[#c4c4c4]"></div>
            <div className="text-sm text-[#6f6f6f]">or continue</div>
            <div className="flex-1 h-[1px] bg-[#c4c4c4]"></div>
          </div>

          {/* Google button */}
          <div
            onClick={googleloginhandler}
            className="w-[80%] h-[40px] border border-black rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            <img src={google} className="w-[20px]" alt="Google" />
            <span className="ml-2 text-base text-gray-600 font-medium">
              Google
            </span>
          </div>

          <div className="text-[#6f6f6f]">
            Create new account{" "}
            <span
              className="underline underline-offset-1 text-black cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="w-[80%] mt-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md text-sm">
              <ul className="list-disc pl-5">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex md:w-1/2 h-full rounded-r-2xl bg-black items-center justify-center flex-col">
          <img src={logo} alt="logo" className="w-32 shadow-2xl mb-4" />
          <span className="text-2xl text-white font-semibold">
            Learning Hub
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
