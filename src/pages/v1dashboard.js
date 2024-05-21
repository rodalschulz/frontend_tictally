import StackedBarChart from "../components/stackedBarChart";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const Dashboard = () => {
  const { userId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      {showSidebar && (
        <nav className="xs:absolute sm:relative xs:h-screen w-36 bg-custom-grey text-white p-4 flex flex-col space-y-4">
          <button className="btn btn-primary">Dashboard</button>
          <button className="btn btn-primary">My Tally</button>
          <button className="btn btn-primary">Pending</button>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-bold mb-4">Chart 1</div>
        <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md">
          <StackedBarChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
