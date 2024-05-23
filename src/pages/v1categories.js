// import * as SDK from "../sdk_backend_fetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Categories = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // HANDLE WINDOW SIZE
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  // NAVIGATION
  const navigateDashboard = () => {
    window.location.href = `/members/${userId}/dashboard`;
  };
  const navigateTally = () => {
    window.location.href = `/members/${userId}/tally`;
  };
  //   const navigateCategories = () => {
  //     window.location.href = `/members/${userId}/categories`;
  //   };

  return (
    <div className="flex h-screen bg-gray-300 overflow-x-auto">
      {showSidebar && (
        <nav className="xs:absolute sm:relative xs:h-screen w-36 bg-custom-grey text-white p-4 flex flex-col space-y-4">
          <button className="btn btn-primary" onClick={navigateDashboard}>
            Dashboard
          </button>
          <button className="btn btn-primary" onClick={navigateTally}>
            My Tally
          </button>
          <button className="btn btn-primary">Pending</button>
          <button className="btn btn-primary">Categories</button>
          <button className="btn btn-primary">Collabs</button>
          <button className="btn btn-primary" onClick={logOut}>
            Log Out
          </button>
        </nav>
      )}
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white text-sm px-1 py-2 h-10 rounded-none mt-4 rounded-tr-md rounded-br-md z-50"
      >
        {showSidebar ? ">" : "<"}
      </button>

      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold mb-4 text-white mr-5 flex justify-between items-center">
          Categories & Limits
        </h1>
      </main>
    </div>
  );
};

export default Categories;
