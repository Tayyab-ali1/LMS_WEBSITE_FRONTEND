import axios from 'axios';
import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userslice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function EditProfile() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const [name, setName] = useState(userData?.user?.name || "");
  const [description, setDescription] = useState(userData?.user?.description || "");
  const [photoPreview, setPhotoPreview] = useState(userData?.user?.photoUrl || null);
  const [photoFile, setPhotoFile] = useState(null); // ✅ store actual File
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData(); // ✅ fresh every submit
      formData.append("name", name);
      formData.append("description", description);
      if (photoFile) {
        formData.append("photoUrl", photoFile); // ✅ actual file, not preview URL
      }

      const result = await axios.post(
        serverUrl + "/api/get/updateprofile",
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Profile updated");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // ✅ save file
      setPhotoPreview(URL.createObjectURL(file)); // ✅ preview image
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong
          className="absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="flex flex-col items-center text-center">
            {photoPreview ? (
              <img
                src={photoPreview}
                className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
                alt="avatar"
              />
            ) : (
              <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white">
                {userData?.user?.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="image" className="text-sm font-medium text-gray-700">
              Select Avatar
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              UserName
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              readOnly
              type="email"
              value={userData?.user?.email}
              className="w-full px-4 py-2 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe yourself"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-[black]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[black] active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer"
            disabled={Loading}
            onClick={handleEditProfile}
          >
            {Loading ? <ClipLoader size={30} color="white" /> : " Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
