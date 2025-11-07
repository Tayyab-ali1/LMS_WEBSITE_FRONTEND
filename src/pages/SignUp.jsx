import React, { useState } from "react";
import logo from "../assets/lhlogo.png";
import google from "../assets/google.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import useGetUser from "../customhook/getuser";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userslice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase"; // make sure you have this


function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
   const dispatch=useDispatch()
 const handleSignup = async () => {
  setErrors([]);
  if (!name || !email || !password) {
    setErrors(["Please fill in all fields"]);
    return;
  }

  setLoading(true);
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/register`,
      { name, email, password, role },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data));
    toast.success("Signup successful!");

    // ✅ navigate properly
    navigate("/", { replace: true });
    window.location.reload()
  } catch (error) {
    console.error(error);
    const backendErrors =
      error?.response?.data?.errors || [error?.response?.data?.message || "Signup failed"];
    setErrors(backendErrors);
  } finally {
    setLoading(false);
  }
};

const googleloginhandler = async () => {
  try {
    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    const result = await axios.post(
      `${serverUrl}/api/user/google`,
      { name: user.displayName, email: user.email, role },
      { withCredentials: true }
    );

    dispatch(setUserData(result.data));
    toast.success("Google login successful");

    // ✅ navigate properly
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
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-[90%] md:w-[800px] h-[650px] bg-white shadow-xl rounded-2xl flex relative"
      >
        {/* Left Section */}
        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center gap-3 px-4 pb-16">
          <div className="text-center mb-2">
            <h1 className="font-semibold text-black text-2xl">Let's get started</h1>
            <h2 className="text-[#999797] text-lg">Create your account</h2>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1 w-[80%]">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="border w-full h-[35px] border-[#e7e6e6] text-sm px-4 rounded"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled={loading}
            />
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div className="flex w-[80%] items-center gap-3 justify-center">
            <span
              className={`px-3 py-1 border-2 rounded-xl cursor-pointer ${
                role === "student" ? "border-black" : "border-[#c4c4c4]"
              }`}
              onClick={() => !loading && setRole("student")}
            >
              Student
            </span>
            <span
              className={`px-3 py-1 border-2 rounded-xl cursor-pointer ${
                role === "educator" ? "border-black" : "border-[#c4c4c4]"
              }`}
              onClick={() => !loading && setRole("educator")}
            >
              Educator
            </span>
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-md disabled:opacity-60"
          >
            {!loading ? "Sign Up" : <ClipLoader size={24} color="white" />}
          </button>

          {/* Divider */}
          <div className="w-[80%] flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-[#c4c4c4]"></div>
            <div className="text-sm text-[#6f6f6f]">or continue</div>
            <div className="flex-1 h-[1px] bg-[#c4c4c4]"></div>
          </div>

          {/* Google Button */}
          <div  onClick={googleloginhandler} className="w-[80%] h-[40px] border border-black rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <img src={google} className="w-[20px]" alt="Google" />
            <span className=" text-base text-gray-600 font-medium">
            oogle
            </span>
          </div>

          <div className="text-[#6f6f6f]">
            Already have an account?{" "}
            <span
              className="underline underline-offset-1 text-black cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
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
          <span className="text-2xl text-white font-semibold">Learning Hub</span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
