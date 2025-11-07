import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userslice";

const useGetUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/get/getuserdetail",
          { withCredentials: true }
        );

        // API wrapper returns { statuscode, data, success, message }
        // so we should dispatch result.data.data
        dispatch(setUserData(result.data.data));
        console.log("✅ User fetched:", result.data.data);
      } catch (error) {
        console.log("❌ Error fetching user:", error);
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [1]); // include dispatch in deps
};

export default useGetUser;
