import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedCourse } from '../redux/courseSlice';
import img from "../assets/empty.jpg"
import { IoStar } from "react-icons/io5";
import { FaPlayCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import Card from '../component/card';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData, selectedCourse } = useSelector(state => state.course);
  const dispatch = useDispatch();
  const [selectedLecture,setSelectedLecture]= useState(null) 
  const [creatorData,setCreatorData]= useState(null)
  const [creatorCourses,setCreatorCourses]= useState(null)
  const [rating,setRating]= useState(0)
  const[comment,setComment] = useState("")
  const [loading,setLoading]= useState(false)




  const fetchCoursesData = () => {
    const found = courseData.find((course) => course._id === courseId);
    if (found) dispatch(setSelectedCourse(found));
  };
  console.log(selectedCourse)
   useEffect(()=>{
  
    const handleCreator = async () => {
          if(selectedCourse){
           try {
             const result = await axios.post(serverUrl+"/api/course/creator",{userId:selectedCourse?.creator},{withCredentials:true})
                console.log(result.data)
                setCreatorData(result.data)
           } catch (error) {
            console.log(error)
           }
       
         }
    }
    handleCreator()
   },[selectedCourse])

  useEffect(() => {
    fetchCoursesData();
  }, [courseData, courseId]);
   
  useEffect(()=>{
    if(creatorData?._id && courseData.length>0){
        const creatorcourse = courseData.filter (
            (course)=>course.creator === creatorData?._id && course._id !== courseId)
              setCreatorCourses(creatorcourse)
    }
  },[creatorData,courseData])

  const handleReview = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/review/createreview",{rating,comment,courseId},{withCredentials:true})
      setLoading(false)
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
       setRating(0)
      setComment("")
    }
  }
  const calculateAvgReview = (reviews = []) => {
  if (!reviews.length) return 0;

  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return (total / reviews.length).toFixed(1);
};

const avgRating = calculateAvgReview(selectedCourse?.reviews || []);
console.log("Avg Rating:", avgRating);

  return (
    <div className='min-h-screen bg-gray-50 p-6'> 
      <div className='max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative'>
        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-1/2'>
            <FaArrowLeftLong
              className='text-[black] w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")}
            />
            <img
              src={selectedCourse?.thumbnail || img}
              alt=''
              className='rounded-xl w-full object-cover'
            />
          </div>

          <div className='flex-1 space-y-2 mt-[20px]'>
            <h2 className='text-2xl font-bold'>{selectedCourse?.title}</h2>
            <p className='text-gray-600'>{selectedCourse?.subtitle}</p>

            <div className='flex items-start flex-col justify-between'>
              <div className='text-yellow-500 font-medium flex gap-2'>
                <span className='flex items-center justify-start gap-1'><IoStar />{avgRating}</span>
                <span className='text-gray-400'>(1,200 Reviews)</span>
              </div>
              <div>
                <span className='text-xl font-semibold text-black'>${selectedCourse?.price}</span>
                <span className='line-through text-sm text-gray-400'>$599</span>
              </div>
              <ul className='text-sm text-gray-700 space-y-1 pt-2'>
                <li>✅ 10+ hours of video content</li>
                <li>✅ Lifetime access to course materials</li>
              </ul>
              <button onClick={()=> navigate(`/viewlecture/${courseId}`)} className='bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer'>
                Watch Now
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-2'>What You'll Learn</h2>
          <ul className='list-disc pl-6 text-gray-700 space-y-1'>
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-2'>Who this Course is For</h2>
          <p className='text-gray-700'>
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200'>
            <h2 className='text-xl font-bold mb-1 text-gray-800'>Course Curriculum</h2>
            <p className='text-sm text-gray-500 mb-4'>
              {selectedCourse?.lectures?.length || 0} Lectures
            </p>

            <div className='flex flex-col gap-3'>
              {selectedCourse?.lectures?.map((lectures, index) => (
                <button
                  key={index}
                  disabled={!lectures.isPreviewFree}
                   onClick={()=>{if(lectures.isPreviewFree){
                      setSelectedLecture(lectures)
                   }}}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border
                     transition-all duration-200 text-left
                      ${lectures.isPreviewFree ? "hover:bg-gray-100 cursor-pointer border-gray-300" 
                        : "cursor-not-allowed opacity-600 border-gray-200"}
                         ${selectedLecture?.lectureTitle=== lectures?.lectureTitle? "bg-gray-100 border-gray-400":""} `}>
                            <span className='text-lg text-gray-700'>
                                {lectures.isPreviewFree ?  <FaPlayCircle /> :<FaLock/> }
                            </span>
                            <span className='text-sm font-medium text-gray-800'>{lectures?.lectureTitle}</span>
                
                  {console.log(lectures.isPreviewFree)}
                </button>
                
              ))}
            </div>
          </div>
          <div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200'> 
          <div className='aspect-video w-full rounded-lg  overflow-hidden mb-6
           bg-black flex items-center justify-center'>
            {selectedLecture?.videoUrl? <video className='w-full h-full object-cover'
            src={selectedLecture?.videoUrl} controls/>: 
             <span className='text-white text-sm'>Select a preview lecture to watch</span>
             }
           </div>   
          </div>
        </div>
        <div className='mt-8 border-t pt-6 '>
          <h2 className='text-xl font-semibold mb-2'>Write a Reviews</h2>
          <div className='mb-4 '>
            <div className='flex gap-1 mb-2 '>
                {
                    [1,2,3,4,5].map((star)=>(
                        <IoStar key={star} onClick={()=>setRating (star)}
                         className={star <= rating ?  "fill-amber-300": "fill-gray-300"}/>
                    ))
                }
            </div>
            <textarea onChange={(e)=>setComment(e.target.value)} value={comment} className='w-full border border-gray-300 rounded-lg p-2'
             placeholder=' Write your review here... '
             rows={3}
             /> 
             <button className='bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800' disabled={loading}
             onClick={handleReview}>{loading? <ClipLoader size={30} color='white'/>: "Submit Review"}</button>
              
           
          </div>
        </div>

        {/* for creator info */}
        <div className='flex items-center gap-4 pt-4 border-t'>
        { creatorData?.photoUrl ?  <img src={creatorData?.photoUrl} alt="" 
        className=' border-1 border-gray-200 w-16 h-16 rounded-full object-cover' />:<img src={img} alt=""
          className='w-16 h-16 rounded-full object-cover  border-1 border-gray-200'/> }
        </div>
        {console.log(creatorData)}

        <div>
            <h2 className='text-lg font-semibold'>{creatorData?.name}</h2>
            <p className='md:text-sm text-gray-600 text-[10px]'>{creatorData?.description}</p>
            <p  className='md:text-sm text-gray-600 text-[10px]'>{creatorData?.email}</p>
        </div>
      </div>

      <div className='text-center'>
        <p className='mt-4 text-xl font-semibold  mb-2'>Other Published Courses  -</p>
      </div>
      <div className=' w-full transition-all duration-300 py-[20px] flex items-start flex-wrap gap-6 lg:px-[80px] lg:ml-17 '>
       {
        courseData?.map((course, index)=>(
          <Card key={index}  id={course._id} thumbnail={course?.thumbnail} price={course?.price}
           title={course.title} category={course.category}/>
         
        ))
       }
      </div>

    </div>
  );
}

export default ViewCourse;
