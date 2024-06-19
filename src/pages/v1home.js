import { Link } from "react-router-dom";
import "../styles/v1home.css";
import { useState } from "react";
import * as SDK from "../sdk_backend_fetch.js";

const Home = () => {
  const [visitorData, setVisitorData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const resetForm = () => {
    setVisitorData({
      name: "",
      email: "",
      message: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitorData({
      ...visitorData,
      [name]: value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await SDK.visitorEmail(
        visitorData.email,
        visitorData.name,
        visitorData.message
      );
      alert(response.response);
      resetForm();
    } catch (error) {
      console.log(error);
      alert("Email failed to send");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 font-sans">
      <div className="max-w-7xl w-full bg-white shadow-lg overflow-hidden">
        <nav className="flex justify-between items-center w-full py-4 bg-primary text-white px-10">
          <div className="text-3xl font-bold">tictally</div>
          <div className="flex space-x-4 items-center">
            <Link to="" className="hover:text-gray-200 transition duration-300">
              Pricing
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-primary rounded-full shadow hover:bg-gray-200 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-section relative w-full h-60vh">
          <img
            src="/images/tictally-background.png"
            alt="Background"
            className="hero-background w-full h-full object-cover"
          />
          <div className="hero-content flex flex-col items-center justify-center bg-white bg-opacity-75 w-full py-64 absolute top-0 left-0">
            <h2 className="text-6xl font-bold text-secondary mb-4 animate-slide-up">
              tictally
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl text-center animate-slide-up delay-200">
              Track your activities. Stay productive.
            </p>
            <Link to="/register">
              <button className="px-8 py-4 bg-primary text-white rounded-full shadow-lg hover:bg-custom-primaryDark transition duration-300 transform hover:scale-105">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-10 animate-fade-in delay-500">
          <div className="feature-box p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-secondary mb-4">
              Track Activities
            </h3>
            <p className="text-gray-500">
              Monitor and manage your daily tasks and activities effortlessly.
            </p>
          </div>
          <div className="feature-box p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-secondary mb-4">
              Stay Productive
            </h3>
            <p className="text-gray-500">
              Boost your productivity with our intuitive tracking system.
            </p>
          </div>
          <div className="feature-box p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-secondary mb-4">
              Achieve Your Goals
            </h3>
            <p className="text-gray-500">
              Set and achieve your goals with clear progress tracking.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-10 animate-slide-up">
            How It Works
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-xs bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="/images/tally.png"
                alt="Step 1"
                className="mx-auto mb-4 rounded-badge transform hover:scale-110 transition duration-300 w-52 h-42"
              />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Add Activities
              </h3>
              <p className="text-gray-500">
                Make self-reported entries of each activity you perform.
              </p>
            </div>
            <div className="max-w-xs bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="/images/tally2.png"
                alt="Step 2"
                className="mx-auto mb-4 rounded-badge transform hover:scale-110 transition duration-300 w-52 h-42"
              />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Check Progress
              </h3>
              <p className="text-gray-500">
                View your daily, weekly and monthly progress at a glance.
              </p>
            </div>
            <div className="max-w-xs bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="/images/tally3.png"
                alt="Step 3"
                className="mx-auto mb-4 rounded-badge transform hover:scale-110 transition duration-300 w-52 h-42"
              />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Customize
              </h3>
              <p className="text-gray-500">
                Set your custom subcategories and limits.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-10 animate-slide-up">
            Testimonials
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-md bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="https://media.licdn.com/dms/image/D4E03AQF6xM_MIG2PpA/profile-displayphoto-shrink_800_800/0/1677782830318?e=1723075200&v=beta&t=QpR9QrjVE75AmslS367wjwDVG4cWBlBf-Xm2RRs97uI"
                alt="User 1"
                className="mx-auto rounded-full mb-4 w-24"
              />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Cris Seoane
              </h3>
              <p className="text-gray-500 italic">
                "TicTally is a great tool for tracking how much time I spend on
                my projects!"
              </p>
            </div>
            <div className="max-w-md bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="https://avatars.githubusercontent.com/u/151292928?s=400&u=e786e2a29e736962cc67047b459de28c5f9525fb&v=4"
                alt="User 2"
                className="mx-auto rounded-full mb-4 w-24"
              />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Rod Schulz
              </h3>
              <p className="text-gray-500 italic">
                "It's a minimalistic and easy-to-use app that helps me focus on
                one task at a time."
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20 bg-gray-50 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-10 animate-slide-up">
            Contact Us
          </h2>
          <form
            onSubmit={submit}
            className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-left mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                type="text"
                id="name"
                placeholder="Your Name"
                name="name"
                value={visitorData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-left mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                type="email"
                id="email"
                placeholder="Your Email"
                name="email"
                value={visitorData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-left mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                id="message"
                rows="4"
                placeholder="Your Message"
                name="message"
                value={visitorData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-primary text-white rounded-full shadow-lg hover:bg-custom-primaryDark transition duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Home;
