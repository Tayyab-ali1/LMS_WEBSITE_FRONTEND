import { createSlice } from "@reduxjs/toolkit";
import { useRouteLoaderData } from "react-router-dom";


 const courseslice = createSlice( { 
    name: "course",
    initialState:{
        creatorCourseData:null ,
        selectedCourse:null
    },
    reducers:{
        setCreatorCourseData:(state,action)=>{
            state.creatorCourseData = action.payload

        },
         setCourseData:(state,action)=>{
            state.courseData = action.payload

        },
        setSelectedCourse:(state,action)=>{
            state.selectedCourse = action.payload
        }
    }
})
   
export const {setCreatorCourseData}=courseslice.actions
export const {setCourseData}=courseslice.actions
export const {setSelectedCourse}= courseslice.actions
export default courseslice.reducer