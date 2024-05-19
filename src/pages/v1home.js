import "../styles/v1home.css";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">TicTally</h2>
        <p className="text-lg text-gray-600 mb-8">
          Track your activities. Stay productive.
        </p>
        <Link to="/login">
          <button className="btn btn-primary">Sign In</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
