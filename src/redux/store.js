import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice"; // ✅ use consistent name
import courseslice  from "./courseslice"
import lectureSlice from './lectureSlice'
import reviewSlice from './reviewSlice'
export const store = configureStore({
  reducer: {
    user: userReducer, // ✅ lowercase key
    course:courseslice,
    lecture:lectureSlice,
    review: reviewSlice
  },
});
