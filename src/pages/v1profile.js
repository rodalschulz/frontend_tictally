import { MdMenuOpen } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useState } from "react";

import * as SDK from "../sdk_backend_fetch.js";
import Sidebar from "../components/sidebar.js";

const Profile = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [displayInstructions, setDisplayInstructions] = useState(false);

  const [popupConfirm, setPopupConfirm] = useState(false);
  const [input, setInput] = useState({
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await SDK.deleteAccount(userId, input.password);
      console.log(response);
      if (response.response === "User deleted") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openSidebar = () => {
    setShowSidebar(true);
  };

  const handleDeleteClick = () => {
    setPopupConfirm(true);
  };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      <div className="absolute z-50 mt-[50vh] bg-secondary text-white rounded-r-md">
        {!showSidebar && (
          <button className="ml-1 mt-1" onClick={openSidebar}>
            <MdMenuOpen />
          </button>
        )}
      </div>
      <Sidebar
        userId={userId}
        displayInstructions={displayInstructions}
        setDisplayInstructions={setDisplayInstructions}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <main
        className={`sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 w-[130rem] ${
          showSidebar && "ml-16"
        }`}
      >
        <h1 className="text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white items-center">
          Profile
        </h1>
        <button
          className="ml-4 bg-red-700 rounded-lg text-white p-4"
          onClick={handleDeleteClick}
        >
          DELETE ACCOUNT
        </button>
        <div className="flex items-center justify-center">
          {popupConfirm && (
            <div className="absolute bg-red-700 border-2 border-secondary text-white p-4 rounded-lg ml-2 mr-2 mt-32">
              <div className="mb-2">
                Are you sure you want to delete your account?
              </div>
              <div className="text-[11px] mb-2">
                All your data will be lost and cannot be recovered.
              </div>
              <div className="text-sm mb-2">
                Write your password to confirm deletion:
              </div>
              <input
                name="password"
                type="password"
                className="rounded-lg text-black pl-2 w-full mb-2"
                onChange={handleInputChange}
              ></input>
              <div className="flex w-full justify-center">
                <button
                  className="bg-red-900 border-2 border-white rounded-lg p-2 hover:bg-red-300"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
