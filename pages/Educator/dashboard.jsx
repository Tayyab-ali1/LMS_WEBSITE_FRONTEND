import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart } from 'recharts';

function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()

  // ✅ Static sample data for testing charts
  const CourseProgressData = [
    { name: "Webdev", lectures: 12 },
    { name: "UI/UX", lectures: 8 },
    { name: "MongoDB", lectures: 5 },
    { name: "Express", lectures: 10 },
    { name: "Next JS", lectures: 6 },
  ];

  const EnrollData = [
    { name: "React JS", enrolled: 50 },
    { name: "Node JS", enrolled: 35 },
    { name: "MongoDB", enrolled: 25 },
    { name: "Express", enrolled: 40 },
    { name: "Next JS", enrolled: 30 },
  ];

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <FaArrowLeftLong
        className='w-[22px] absolute top-[10%] left-[10%] h-[22px] cursor-pointer'
        onClick={() => navigate("/")}
      />

      <div className='w-full px-6 py-10 bg-gray-50 space-y-10'>
        {/* main section */}
        <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6'>
          <img
            src={userData?.user?.photoUrl || ""}
            className='w-28 h-28 rounded-full object-cover border-4 border-black shadow-md'
            alt="Educator"
          />

          <div className='text-center md:text-left space-y-1'>
            <h1 className='text-2xl font-bold text-gray-800'>
              Welcome, {userData?.user?.name || "Educator"}
            </h1>
            <h1 className='text-xl font-semibold text-gray-800'>
              Total Earning : 0
            </h1>
            <p className='text-gray-600 text-sm'>
              {userData?.user?.description || "Start Creating Courses for your Students"}
            </p>
            <h1
              className='px-[10px] text-center py-[10px] border-2 bg-black border-black text-white rounded-[10px]
              text-[15px] font-light flex items-center justify-center cursor-pointer'
              onClick={() => navigate("/courses")}
            >
              Create Courses
            </h1>
          </div>
        </div>

        {/* graph section */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* course Progress Graph */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold mb-4'>Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CourseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill='black' radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* enrolled students Graph */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold mb-4'>Course Enrollments</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={EnrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill='black' radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
