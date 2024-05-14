import "../styles/v1home.css";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">TicTally</h1>
        <p className="text-lg text-gray-600 mb-8">
          Track your daily activities. Stay productive.
        </p>
        <Link to="/login">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
