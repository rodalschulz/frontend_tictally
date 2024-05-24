import * as SDK from "../sdk_backend_fetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Categories = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [coreLimits, setCoreLimits] = useState({
    SLEEP: "",
    EAT: "",
    GROOM: "",
    FITNESS: "",
    RELIEF: "",
    INFORM: "",
  });

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

  const handleInputChange = (event, rowIndex, columnIndex) => {
    const { value } = event.target;
    setSubcategories((prevSubcategories) => {
      const newSubcategories = [...prevSubcategories];
      newSubcategories[columnIndex][rowIndex] = value;
      return newSubcategories;
    });
  };

  const handleCoreLimitChange = (event) => {
    const { name, value } = event.target;
    setCoreLimits((prevCoreLimits) => ({
      ...prevCoreLimits,
      [name]: value,
    }));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // FETCH CATEGORY CONFIG
  useEffect(() => {
    const fetchCategoryConfig = async () => {
      try {
        const response = await SDK.getUserCategoryConfig(userId);
        const subcategories = Object.values(
          response.user.categConfig.subcategories
        );
        setSubcategories(subcategories);
      } catch (error) {
        console.error("Error fetching user category config:", error);
      }
    };

    fetchCategoryConfig();
  }, [userId]);

  // NAVIGATION
  const navigateDashboard = () => {
    window.location.href = `/members/${userId}/dashboard`;
  };

  const navigateTally = () => {
    window.location.href = `/members/${userId}/tally`;
  };

  const submitForm = async () => {
    const data = {
      coreLimits: { ...coreLimits },
      subcategories: {
        GENERAL: subcategories[0] || [],
        WORK: subcategories[1] || [],
        LEARN: subcategories[2] || [],
        BUILD: subcategories[3] || [],
        RECOVERY: subcategories[4] || [],
      },
    };

    try {
      await SDK.updateUserCategoryConfig(userId, data);
      alert("Configuration updated successfully!");
    } catch (error) {
      console.error("Error updating configuration:", error);
      alert("There was an error updating the configuration.");
    }
  };

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
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold text-white mr-5 flex justify-between items-center">
          Category Configuration
        </h1>
        <div className="w-40">
          <form className="flex">
            <table className="min-w-full bg-white text-sm border border-gray-200 rounded-lg shadow-md mr-2">
              <thead>
                <tr>
                  <th className="px-7 py-2">CORE</th>
                  <th className="px-7 py-2">LIMITS</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(coreLimits).map((limit, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{limit}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name={limit}
                        value={coreLimits[limit]}
                        onChange={handleCoreLimitChange}
                        className="w-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="min-w-full bg-white text-sm border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-7 py-2">GENERAL</th>
                  <th className="px-7 py-2">WORK</th>
                  <th className="px-7 py-2">LEARN</th>
                  <th className="px-7 py-2">BUILD</th>
                  <th className="px-7 py-2">RECOVERY</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {subcategories.map((column, columnIndex) => (
                      <td key={columnIndex} className="border px-4 py-2">
                        <input
                          type="text"
                          className="w-full"
                          value={column[rowIndex] || ""}
                          onChange={(e) =>
                            handleInputChange(e, rowIndex, columnIndex)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={submitForm}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
};

export default Categories;
