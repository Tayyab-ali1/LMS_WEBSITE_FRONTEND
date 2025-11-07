import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import ai from "../assets/ai.png";
import { FaMicrophoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";
import start from "../assets/start.mp3";

function Searchwithai() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState([]);
  const startSound = new Audio(start);
  const [listning, setlistning] = useState(false);

  // ✅ Function to make AI speak
  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Properly detect browser support
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    toast.error("Speech recognition is not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // ✅ Function to handle recommendations
  const handleRecommendation = async (query) => {
    try {
      const result = await axios.post(
        serverUrl + "/api/course/search",
        { input: query },
        { withCredentials: true }
      );

      console.log(result.data);
      setlistning(false);
      setRecommendation(result.data);

      if (result.data.length > 0) {
        speak("These are the top courses I found for you");
      } else {
        speak("No course found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching recommendations");
      setlistning(false);
    }
  };

  // ✅ Main voice search handler
  const handleSearch = async () => {
    try {
      setlistning(true);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      startSound.play();
      recognition.start();

      recognition.onstart = () => {
        toast.info("🎙️ Listening...");
      };

      recognition.onresult = async (e) => {
        const transcript = e.results[0][0].transcript.trim();
        console.log("Voice Input:", transcript);
        setInput(transcript);
        await handleRecommendation(transcript);
      };

      recognition.onerror = (err) => {
        console.error("Speech recognition error:", err);
        if (err.error === "no-speech") {
          toast.warn("No speech detected, please try again 🎤");
        } else {
          toast.error("Speech recognition failed");
        }
      };
    } catch (err) {
      toast.error("Microphone permission denied or not available");
      console.error("Mic error:", err);
    }
  };

  console.log(recommendation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-1">
      {/* Search container */}
      <div className="bg-white shadow-xl mt-10 rounded-3xl py-6 sm:p-8 w-full max-w-2xl text-center relative">
        <FaArrowLeftLong
          className="text-black w-[22px] h-[22px] cursor-pointer absolute"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          Search with{" "}
          <img
            src={ai}
            alt=""
            className="w-8 h-8 sm:w-[30px] sm:h-[30px]"
          />{" "}
          <span className="text-[#CB99C7]">Ai</span>
        </h1>

        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full">
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="What do you want to learn e.g. AI, MERN ..."
          />

          {input && (
            <button
              className="absolute right-14 sm:right-16 bg-white rounded-full"
              onClick={() => handleRecommendation(input)}
            >
              <img src={ai} alt="" className="w-10 h-10 rounded-full p-2" />
            </button>
          )}

          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleSearch}
          >
            <FaMicrophoneAlt className="w-5 h-5 text-[#cb87c5]" />
          </button>
        </div>
      </div>

      {recommendation.length > 0 ? (
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
          <h1 className="text-xl sm:text-2xl font-semibold md-6 text-white text-center">
            AI SEARCH RESULT
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {recommendation?.map((course, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/viewcourse/${course._id}`);
                }}
                className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all
                duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200"
              >
                <h2 className="text-lg font-bold sm:text-xl">{course.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : listning ? (
        <h1 className="text-center text-xl sm:text2xl mt-10 text-gray-400">
          listning......
        </h1>
      ) : (
        <h1 className="text-center text-xl sm:text2xl mt-10 text-gray-400">
          courses not found yet
        </h1>
      )}
    </div>
  );
}

export default Searchwithai;
