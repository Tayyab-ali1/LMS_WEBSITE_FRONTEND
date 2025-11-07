import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function ForgetPassword() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [NewPassword, setNewPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [Loading, setLoading] = useState(false)

  // step 1
  const sendOpt = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/get/getotp", { email }, { withCredentials: true })
      console.log(result.data)
      setLoading(false)
      setStep(2)
      toast.success(result.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
      setLoading(false)
    }
  }

  // step 2
  const verifyOTP = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/get/verifyotp", { email, otp }, { withCredentials: true })
      console.log(result.data)
      setLoading(false)
      setStep(3)
      toast.success(result.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
      setLoading(false)
    }
  }

  // step 3
  const resetPassword = async () => {
    setLoading(true)
    try {
      if (NewPassword !== conPassword) {
        setLoading(false)
        return toast.error("Password is not matched")
      }
      const result = await axios.post(
        serverUrl + "/api/get/resetpassword",
        { email, password: NewPassword },
        { withCredentials: true }
      )
      console.log(result.data)
      setLoading(false)
      navigate("/login")
      toast.success(result.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      {/* step1 */}
      {step === 1 && (
        <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Forget Your Password</h2>
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Enter Your Email Address</label>
              <input
                id='email'
                type="text"
                className='mt-1 w-full px-4 py-2 border border-b-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-[black]'
                placeholder='you@email.com'
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              className='w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer'
              disabled={Loading}
              onClick={sendOpt}
            >
              {Loading ? <ClipLoader size={30} color='white' /> : "Send OTP"}
            </button>
          </form>
          <div className='text-sm text-center mt-4' onClick={() => navigate("/login")}>Back To Login</div>
        </div>
      )}

      {/* step2 */}
      {step === 2 && (
        <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Enter OTP</h2>
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="OTP" className='block text-sm font-medium text-gray-700'>Please Enter The 4-Digit code sent to your Email. </label>
              <input
                id='OTP'
                type="text"
                className='mt-1 w-full px-4 py-2 border border-b-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-[black]'
                placeholder='* * * *'
                required
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>
            <button
              className='w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer'
              disabled={Loading}
              onClick={verifyOTP}
            >
              {Loading ? <ClipLoader size={30} color='white' /> : "Verify OTP"}
            </button>
          </form>
          <div className='text-sm text-center mt-4' onClick={() => navigate("/login")}>Back To Login</div>
        </div>
      )}

      {/* step3 */}
      {step === 3 && (
        <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Reset Your Password</h2>
          <p className='text-sm text-gray-500 text-center mb-6'>Enter a new password below to regain access to your account.</p>
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="Password" className='block text-sm font-medium text-gray-700'>New Password </label>
              <input
                id='Password'
                type="password"
                className='mt-1 w-full px-4 py-2 border border-b-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-[black]'
                placeholder='********'
                required
                onChange={(e) => setNewPassword(e.target.value)}
                value={NewPassword}
              />
            </div>
            <div>
              <label htmlFor="ConPassword" className='block text-sm font-medium text-gray-700'>Confirm Password </label>
              <input
                id='ConPassword'
                type="password"
                className='mt-1 w-full px-4 py-2 border border-b-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-[black]'
                placeholder='********'
                required
                onChange={(e) => setConPassword(e.target.value)}
                value={conPassword}
              />
            </div>
            <button
              className='w-full bg-black hover:bg-[#4b4b4b] text-white py-2 px-4 rounded-md font-medium cursor-pointer'
              disabled={Loading}
              onClick={resetPassword}
            >
              {Loading ? <ClipLoader size={30} color='white' /> : "Reset Password"}
            </button>
          </form>
          <div className='text-sm text-center mt-4' onClick={() => navigate("/login")}>Back To Login</div>
        </div>
      )}
    </div>
  )
}

export default ForgetPassword
