import { Link } from "react-router-dom";
import { useState } from "react";

import * as SDK from "../sdk_backend_fetch.js";
import "../styles/v1home.css";
import { FaExternalLinkAlt } from "react-icons/fa";
import useWindowSize from "../hooks/useWindowSize.js";

const Home = () => {
  const [visitorData, setVisitorData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const isMobile = useWindowSize();

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
    <div className="flex flex-col items-center min-h-screen bg-black font-sans">
      <div className="max-w-7xl w-full bg-white shadow-lg overflow-hidden">
        <nav className="flex justify-between items-center w-full py-4 bg-primary text-white px-5">
          {!isMobile && (
            <div className="text-3xl font-bold">
              <img
                src="/images/logoWhite.png"
                alt="Step 1"
                className="w-44 h-11 opacity-50"
              />
            </div>
          )}
          <div className="flex w-full justify-end space-x-6">
            <div>
              {!isMobile && (
                <Link
                  to="https://www.patreon.com/rodschulz/membership"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-gray-200 transition duration-300 flex items-center ${
                    isMobile && "text-[0.875rem]"
                  }`}
                >
                  Support This Project
                  <FaExternalLinkAlt className="ml-1" />
                </Link>
              )}
            </div>
            <div className="">
              <Link
                to="https://www.youtube.com/watch?v=Gm19-JiZOwk&t"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition duration-300"
              >
                Tutorial
              </Link>
            </div>
            <div className="">
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-primary rounded-full shadow hover:bg-gray-200 transition duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-section relative w-full h-60vh">
          <img
            src="/images/tictally-background.png"
            alt="Background"
            className="hero-background w-full h-full object-cover"
          />
          <div className="hero-content flex flex-col items-center justify-center bg-slate-700 bg-opacity-75 w-full py-64 absolute top-0 left-0">
            <h2
              className={`font-bold text-secondary ${
                !isMobile ? "-mt-10 text-6xl" : "-mt-16 text-5xl"
              } mb-2 animate-slide-up`}
            >
              <img
                src="/images/logoDark.png"
                alt="Step 1"
                className="mx-auto rounded-badge transform hover:scale-110 transition duration-300 w-[7em] -mt-[1em] -mb-4 brightness-200 saturate-0"
              />
            </h2>
            <p
              className={`${
                !isMobile ? "text-xl" : "text-lg"
              } text-white mb-6 max-w-2xl text-center animate-slide-up delay-200`}
            >
              Track your activities. Stay productive.
            </p>
            <Link to="/register">
              <button className="px-8 py-4 bg-zinc-900 text-gray-300 rounded-full shadow-lg hover:bg-custom-lightblue hover:text-gray-600 transition duration-300 transform hover:scale-105">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-20 delay-500 bg-black text-gray-100">
          <div className="feature-box p-6 bg-zinc-900  rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-4">Track Activities</h3>
            <p className="text-gray-300">
              Monitor and manage your daily tasks and activities effortlessly.
            </p>
          </div>
          <div className="feature-box p-6 bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold  mb-4">Stay Productive</h3>
            <p className="text-gray-300">
              Boost your productivity with our intuitive tracking system.
            </p>
          </div>
          <div className="feature-box p-6 bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-semibold mb-4">Achieve Your Goals</h3>
            <p className="text-gray-300">
              Set and achieve your goals with clear progress tracking.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-zinc-900 text-center">
          <h2 className="text-4xl font-bold mb-10 animate-slide-up text-white">
            How It Works
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-xs bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="/images/tally.png"
                alt="Step 1"
                className="mx-auto mb-4 rounded-badge transform hover:scale-110 transition duration-300 w-52 h-42"
              />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                Add Activities
              </h3>
              <p className="text-gray-500">
                Make self-reported entries of each activity you perform.
              </p>
            </div>
            <div className="max-w-xs bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="/images/tally2.png"
                alt="Step 2"
                className="mx-auto mb-4 rounded-badge transform hover:scale-110 transition duration-300 w-52 h-42"
              />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                Check Progress
              </h3>
              <p className="text-gray-500">
                View your daily, weekly and monthly progress at a glance.
              </p>
            </div>
            <div className="max-w-xs bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              <img
                src="/images/tally3.png"
                alt="Step 3"
                className="mx-auto mb-4 rounded-badge transform hover:scale-110 transition duration-300 w-52 h-42"
              />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                Customize
              </h3>
              <p className="text-gray-500">
                Set your custom subcategories and limits.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 text-center bg-black">
          <h2 className="text-4xl font-bold text-white mb-10 animate-slide-up">
            Testimonials
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-md bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              {/* <img
                src="https://media.licdn.com/dms/image/v2/D4E03AQF6xM_MIG2PpA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1677782830318?e=1732752000&v=beta&t=jCytSKDKQEcQU9BHYa9dKZ4pZlDTcXyb0-3qgWKlKNY"
                alt="User 1"
                className="mx-auto rounded-full mb-4 w-24"
              /> */}
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                Cris Seoane
              </h3>
              <p className="text-gray-500 italic">
                "TicTally is a great tool for tracking how much time I spend on
                my projects!"
              </p>
            </div>
            <div className="max-w-md bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
              {/* <img
                src="https://avatars.githubusercontent.com/u/151292928?s=400&u=e786e2a29e736962cc67047b459de28c5f9525fb&v=4"
                alt="User 2"
                className="mx-auto rounded-full mb-4 w-24"
              /> */}
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">
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
        <section className="py-20 bg-zinc-900 text-center">
          <h2 className="text-4xl font-bold text-white mb-10 animate-slide-up">
            Contact Us
          </h2>
          <form
            onSubmit={submit}
            className="max-w-lg mx-auto bg-black p-6 rounded-lg shadow-md"
          >
            <div className="mb-4 ">
              <label
                className="block text-gray-700 text-left mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-zinc-900"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-zinc-900"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-zinc-900"
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
