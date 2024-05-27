import * as SDK from "../sdk_backend_fetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/sidebar.js";

const Categories = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [subcategories, setSubcategories] = useState({
    GENERAL: [],
    WORK: [],
    LEARN: [],
    BUILD: [],
    RECOVERY: [],
  });
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

  const handleInputChange = (event, rowIndex, columnIndex, category) => {
    const { value } = event.target;
    setSubcategories((prevSubcategories) => {
      const newSubcategories = { ...prevSubcategories };
      newSubcategories[category][rowIndex] = value;
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
        setSubcategories(response.user.categConfig.subcategories);
        setCoreLimits(response.user.categConfig.coreLimits);
      } catch (error) {
        console.error("Error fetching user category config:", error);
      }
    };

    fetchCategoryConfig();
  }, [userId]);

  const submitForm = async () => {
    const cleanSubcategories = Object.fromEntries(
      Object.entries(subcategories).map(([key, value]) => [
        key,
        value.filter((subcat) => subcat !== ""),
      ])
    );

    const data = {
      coreLimits: { ...coreLimits },
      subcategories: cleanSubcategories,
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
      <Sidebar userId={userId} />

      <main className="flex-1 sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2 text-white ml-16">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold mr-5 flex justify-between items-center">
          Category Configuration
        </h1>
        <div className="w-40">
          <form className="flex">
            <table className="min-w-full rounded-lg bg-secondary shadow-md mr-2">
              <thead className="">
                <tr>
                  <th className="px-7 py-2" colSpan={2}>
                    CORE LIMITS
                  </th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {Object.keys(coreLimits).map((limit, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{limit}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name={limit}
                        value={coreLimits[limit]}
                        onChange={handleCoreLimitChange}
                        className="w-full bg-inherit border border-primary rounded-lg pl-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="min-w-full rounded-lg bg-secondary shadow-md mr-2">
              <thead>
                <tr>
                  <th className="px-7 py-2">GENERAL</th>
                  <th className="px-7 py-2">WORK</th>
                  <th className="px-7 py-2">LEARN</th>
                  <th className="px-7 py-2">BUILD</th>
                  <th className="px-7 py-2">RECOVERY</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(subcategories).map((category, columnIndex) => (
                      <td key={category} className="px-4 py-2">
                        <input
                          type="text"
                          className="w-32 bg-inherit border border-primary rounded-lg pl-2"
                          value={subcategories[category][rowIndex] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              rowIndex,
                              columnIndex,
                              category
                            )
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
            className="btn btn-wide btn-primary mt-2"
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
