import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCreatorCourseData } from "../redux/courseSlice";
import { serverUrl } from "../App"; // ✅ make sure you import this

function useGetCreatorCourses() {
  const dispatch = useDispatch();
  const {userData} = useSelector (state=>state.user)

  useEffect(() => {
    const fetchCreatorCourses = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/course/getcreator`, {
          withCredentials: true,
        });
        console.log(result.data);
        console.log(userData)
        if (!result) {
          console.log("result not coming")
        }
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.error("Error fetching creator courses:", error);
      }
    };

    if (userData?.user?._id) {
      fetchCreatorCourses();
    }
  }, []);
}

export default useGetCreatorCourses
