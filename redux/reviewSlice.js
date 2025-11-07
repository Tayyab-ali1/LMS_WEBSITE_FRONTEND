import { createSlice } from "@reduxjs/toolkit";
import { useRouteLoaderData } from "react-router-dom";


 const reviewSlice = createSlice( { 
    name: "review",
    initialState:{
       reviewData:[]
    },
    reducers:{
      
         setReviewData:(state,action)=>{
            state.reviewData = action.payload

        },
    }
})
   

export const {setReviewData}=reviewSlice.actions
export default reviewSlice.reducer