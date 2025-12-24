// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl leading-tight">
            Generate Content <span className="text-blue-600">10x Faster</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
            Our full-stack AI Content Assistant, powered by the **Gemini 2.5 Flash API**, lets you create SEO-optimized articles and marketing copy in seconds. Perfect for bloggers, marketers, and developers.
          </p>
          
          <div className="mt-10 flex justify-center space-x-6">
            <Link 
              to="/register" 
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-150"
            >
              Get Started (Free)
            </Link>
            <a 
              href="#features" 
              className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition duration-150"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Placeholder for Features/Visual Demo */}
        <div id="features" className="mt-20 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">The Power of Gemini on a Full Stack</h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
            {/*  */}
            <p>Placeholder for a feature diagram or product screenshot.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;