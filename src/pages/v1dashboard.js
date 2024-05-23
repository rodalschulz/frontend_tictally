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
    <div className="min-h-screen flex flex-col">
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
      <main className="sm:pr-10 sm:pl-6 sm:pt-4 xs:pt-2 xs:pl-2 xs:pr-2">
        <h1 className="sm:min-w-[1400px] w-full text-3xl pl-6 pt-3 pb-3 shadow-lg rounded-lg bg-secondary mb-3 font-bold mb-4 text-white mr-5 flex justify-between items-center">
          Dashboard
        </h1>
      </main>
      <div className="sm:pl-6 items-center justify-center flex-grow bg-gray-100">
        <div
          className="w-full max-w-6xl p-4 bg-white rounded-lg shadow-md h-[75vh]"
          style={{ minHeight: "500px" }}
        >
          <StackedBarChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
