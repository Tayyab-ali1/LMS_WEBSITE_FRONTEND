import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgetPassword from './pages/forgetPassword';
import Profile from './pages/profile';
import EditProfile from './pages/EditProfile';
import Courses from './pages/Educator/Courses';
import Dashboard from './pages/Educator/dashboard'; // ✅ make sure this file exists

export const serverUrl = "http://localhost:8000";

import { ToastContainer } from 'react-toastify';
import useGetUser from './customhook/getuser';
import { useSelector } from 'react-redux';
import CreateCourses from './pages/Educator/CreateCourses';
import getCreatorCourse from './customhook/getCreatorCourse';
import EditCourse from './pages/Educator/EditCourse';
import getPublishedCourse from './customhook/getPublishedCourse';
import AllCourses from './pages/AllCourses';
import CreateLectures from './pages/CreateLecture';
import EditLecture from './pages/Educator/EditLecture';
import ViewCourse from './pages/ViewCourse';
import ScrollToTop from './component/ScrollToTop';
import ViewLecture from './pages/ViewLecture';
import getAllReviews from './customhook/getAllReviews';
import Searchwithai from './pages/Searchwithai';


function App() {
  useGetUser();
  getCreatorCourse()
  getPublishedCourse()
  getAllReviews()

  const { userData } = useSelector(state => state.user);

  return (
    <>
      <ToastContainer />
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/forget"
          element={!userData ? <ForgetPassword /> : <Navigate to="/signup" />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to="/signup" />}
        />

        <Route
          path="/dashboard"
          element={
            userData?.user?.role === 'educator'
              ? <Dashboard />
              : <Navigate to="/signup" />
          }
        />
        <Route
          path="/courses"
          element={
            userData?.user?.role === 'educator'
              ? <Courses />
              : <Navigate to="/signup" />
          }
        />
            <Route
          path="/createcourse"
          element={
            userData?.user?.role === 'educator'
              ? <CreateCourses/>
              : <Navigate to="/signup" />
          }
        />
       <Route
  path="/editcourse/:courseId"
  element={
    userData?.user?.role === 'educator'
      ? <EditCourse />
      : <Navigate to="/signup" />
  }
/>
  <Route
          path="/allcourses"
          element={userData?.user ? <AllCourses /> : <Navigate to="/signup" />}
        />

          <Route
          path="/createlecture/:courseId"
          element={userData ?.user?.role === 'educator'? <CreateLectures /> : <Navigate to="/signup" />}
        />
          <Route
          path="/editlecture/:courseId/:lectureId"
          element={userData ?.user?.role === 'educator'? <EditLecture/> : <Navigate to="/signup" />}
        />
        <Route
          path="/viewcourse/:courseId"
          element={userData ?.user? <ViewCourse/> : <Navigate to="/signup" />}
        />
          <Route
          path="/viewlecture/:courseId"
          element={userData ?.user? <ViewLecture/> : <Navigate to="/signup" />}
        />
         <Route
          path="/search"
          element={userData ?.user? <Searchwithai/> : <Navigate to="/signup" />}
        />
         



      </Routes>

    </>
  );
}

export default App;
