import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import editorDemo from '../assets/dash.png';
import Dashboard from '../assets/dashboard.png';
import Analytics from '../assets/analytics.png';
import Brand from '../assets/brand.png';

const LandingPage = () => {
  
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 ">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <img src={logo} alt="" className="w-12 h-12 hover:scale-105"/>
              <span className="ml-4 text-xl font-bold text-gray-900">Nivo</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to={'/login'} className="text-gray-600 hover:text-gray-900 px-5 py-3 rounded-md text-sm font-medium transition-all duration-200">
                Log In
              </Link>
              <Link to={'/signup'} className="bg-cuspurple text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-opacity-90 transition-all duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="md:pt-20 pt-32" id='demo'>
        <div className="relative">
          {/* Curved Background with Clouds */}
          <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[624px] w-[96%] bg-gradient-to-b from-indigo-200 via-purple-200 to-purple-200 rounded-3xl overflow-hidden">
              {/* Floating Clouds */}
              <div className="cloud-1 absolute w-72 h-72 top-20 left-20 bg-purple-100/50 rounded-full blur-3xl animate-cloud-drift"></div>
              <div className="cloud-2 absolute w-96 h-96 top-40 right-20 bg-indigo-100/50 rounded-full blur-3xl animate-cloud-drift-reverse"></div>
              <div className="cloud-3 absolute w-64 h-64 bottom-40 left-40 bg-pink-100/50 rounded-full blur-3xl animate-cloud-drift-slow"></div>
              <div className="cloud-4 absolute w-48 h-48 bottom-20 right-40 bg-blue-100/50 rounded-full blur-3xl animate-cloud-drift-slow-reverse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Elevate customer experience and cut operational costs</span>
              </h1>
              <p className="mt-6 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Queue management and appointment scheduling system to manage crowd and optimize your business with data-driven decisions
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
                <div className="rounded-md shadow">
                  <Link 
                    to={'/signup'} 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cuspurple hover:bg-opacity-90 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    Try for free
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0">
                  <a 
                    href="https://app.supademo.com/demo/cm4cjw1ys0qzwifugheh0wg1c" target="_blank"
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    View Demo
                  </a>
                </div>
              </div>

              {/* Demo Image Section */}
              <div className="mt-16 max-w-5xl mx-auto hidden lg:block">
                <div className="rounded-t-lg overflow-hidden bg-gray-900">
                  <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <img 
                    src={editorDemo} 
                    alt="Dashboard of nivo" 
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10  sm:mt-12 mb-20 sm:mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-2">
          {/* Stat 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sm:border-none sm:shadow-none sm:bg-transparent">
            <div className="text-center">
              <div className="flex flex-col items-center group">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  30%
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Reduced Waiting
                </h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Smart queue management reduces customer wait times
                </p>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sm:border-none sm:shadow-none sm:bg-transparent">
            <div className="text-center">
              <div className="flex flex-col items-center group">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  25%
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Fewer No-shows
                </h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Automated reminders ensure customers show up on time
                </p>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sm:border-none sm:shadow-none sm:bg-transparent">
            <div className="text-center">
              <div className="flex flex-col items-center group">
                <span className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  30%
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  Lower Operating Costs
                </h3>
                <p className="text-gray-600 text-sm max-w-xs">
                  Optimize staff allocation and operational efficiency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="space-y-32 sm:space-y-40 mb-20" id='features'>
        {/* Feature 1 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Powerful yet simple
            </h2>
            <p className="mt-4 pb-6 sm:pb-10 max-w-2xl mx-auto text-base sm:text-xl text-gray-600">
              Efficiently manage appointments and walk-ins all in one place. 
              Keep customers informed with real-time updates and reminders.
            </p>
            
            <div className="relative mt-10 sm:mt-20">
              <div className="absolute inset-0 -top-20 -bottom-20 z-0 overflow-hidden hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[539px] w-[90%] bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200 rounded-3xl overflow-hidden">
                  <div className="cloud-1 absolute w-64 h-64 top-10 left-20 bg-white/40 rounded-full blur-3xl animate-cloud-drift"></div>
                  <div className="cloud-2 absolute w-72 h-72 top-40 right-20 bg-purple-100/50 rounded-full blur-3xl animate-cloud-drift-reverse"></div>
                  <div className="cloud-3 absolute w-56 h-56 bottom-20 left-40 bg-indigo-100/50 rounded-full blur-3xl animate-cloud-drift-slow"></div>
                </div>
              </div>
              <div className="relative z-10 mt-6 sm:mt-10 max-w-4xl mx-auto">
                <div className="rounded-t-xl overflow-hidden bg-white shadow-lg sm:shadow-none">
                  <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200 bg-gray-900">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <img src={Dashboard} alt="Dashboard of nivo " className="w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Design that aligns <br className='lg:hidden block' /> with your brand
            </h2>
            <p className="mt-4 pb-6 sm:pb-10 max-w-2xl mx-auto text-base sm:text-xl text-gray-600">
              A custom website for your business that allows people to book appointments or join waitlists.
            </p>
            
            <div className="relative mt-10 sm:mt-20">
              <div className="absolute inset-0 -top-20 -bottom-20 z-0 overflow-hidden hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[537px] w-[90%] bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200 rounded-3xl overflow-hidden">
                  <div className="cloud-1 absolute w-64 h-64 top-10 left-20 bg-white/40 rounded-full blur-3xl animate-cloud-drift"></div>
                  <div className="cloud-2 absolute w-72 h-72 top-40 right-20 bg-purple-100/50 rounded-full blur-3xl animate-cloud-drift-reverse"></div>
                  <div className="cloud-3 absolute w-56 h-56 bottom-20 left-40 bg-indigo-100/50 rounded-full blur-3xl animate-cloud-drift-slow"></div>
                </div>
              </div>
              <div className="relative z-10 mt-6 sm:mt-10 max-w-4xl mx-auto">
                <div className="rounded-t-xl overflow-hidden bg-white shadow-lg sm:shadow-none">
                  <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200 bg-gray-900">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <img src={Brand} alt="Branded nivo page " className="w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Data, Data, Data
            </h2>
            <p className="mt-4 pb-6 sm:pb-10 max-w-2xl mx-auto text-base sm:text-xl text-gray-600">
              Make data-driven decisions with comprehensive insights
            </p>
            
            <div className="relative mt-10 sm:mt-20">
              <div className="absolute inset-0 -top-20 -bottom-20 z-0 overflow-hidden hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[528px] w-[90%] bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200 rounded-3xl overflow-hidden">
                  <div className="cloud-1 absolute w-64 h-64 bottom-10 left-20 bg-white/40 rounded-full blur-3xl animate-cloud-drift"></div>
                  <div className="cloud-2 absolute w-72 h-72 top-20 right-20 bg-purple-100/50 rounded-full blur-3xl animate-cloud-drift-reverse"></div>
                  <div className="cloud-3 absolute w-56 h-56 top-40 left-40 bg-indigo-100/50 rounded-full blur-3xl animate-cloud-drift-slow"></div>
                </div>
              </div>
              <div className="relative z-10 mt-6 sm:mt-10 max-w-4xl mx-auto">
                <div className="rounded-t-xl overflow-hidden bg-white shadow-lg sm:shadow-none">
                  <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200 bg-gray-900">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <img src={Analytics} alt="Analytics Dashboard" className="w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="relative max-w-7xl mx-auto">
          {/* Background with Clouds */}
          <div className="absolute inset-0 -z-10 overflow-hidden hidden sm:block">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 rounded-3xl">
              <div className="cloud-1 absolute w-64 h-64 top-10 left-20 bg-white/40 rounded-full blur-3xl animate-cloud-drift"></div>
              <div className="cloud-2 absolute w-72 h-72 bottom-10 right-20 bg-purple-100/50 rounded-full blur-3xl animate-cloud-drift-reverse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative text-center py-8 sm:py-16 px-4 sm:px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Nivo Today
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Start managing your business more efficiently
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="px-8 py-3 bg-cuspurple text-white rounded-md text-lg font-medium hover:bg-opacity-90 transition-all duration-200"
              >
                Get Started
              </Link>
              <a 
                href="https://app.supademo.com/demo/cm4cjw1ys0qzwifugheh0wg1c" 
                target="_blank"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md text-lg font-medium hover:bg-gray-50 transition-all duration-200"
              >
                View Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <img src={logo} alt="" className="w-10 h-10"/>
                <span className="ml-3 text-xl font-bold text-gray-900">Nivo</span>
              </div>
              <p className="text-gray-600 text-sm">
              Nivo improves customer experience with queue and scheduling management, helping businesses handle crowds and make data-driven decisions.              </p>
            </div>
            <div>
              <h3 className="text-gray-900 text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href='#features'  className="text-gray-600 hover:text-gray-900 text-sm">Features</a></li>
                <li><a  className="text-gray-600 hover:text-gray-900 text-sm">Pricing</a></li>
                <li><a href='#demo' className="text-gray-600 hover:text-gray-900 text-sm">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a  className="text-gray-600 hover:text-gray-900 text-sm">About</a></li>
                <li><a  className="text-gray-600 hover:text-gray-900 text-sm">Blog</a></li>
                <li><a className="text-gray-600 hover:text-gray-900 text-sm">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 text-lg font-semibold mb-4">Contact</h3>
              <div className="text-gray-600 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:mssuchith@gmail.com">mssuchith@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Nivo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};



export default LandingPage;