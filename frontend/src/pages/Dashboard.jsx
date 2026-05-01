// components/layout/DashboardLayout.jsx - Layout component with navigation
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Home, Settings, FileText, User, LogOut, Menu, X } from 'lucide-react';
import { MyContext } from '../Context';
import Notification from '../components/Notification';
import './Dashboard.css';

const DashboardLayout = () => {
  const { userLogout, user} = MyContext()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // console.log('user: ', user)
  // const [user] = useState({
  //   name: 'Alex Johnson',
  //   email: 'alex@example.com',
  //   avatar: '/api/placeholder/150/150'
  // });
  
  // Get the current active route to set the title
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.includes('/posts')) return 'Manage Posts';
    if (path.includes('/profile')) return 'User Profile';
    if (path.includes('/settings')) return 'App Settings';
    return 'Dashboard';
  };

  const handleLogout = (e) => {
    e.preventDefault()
    userLogout()
    navigate('/')
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden" onClick={() => setMobileSidebarOpen(false)}></div>
      )}
      <div
        className={`w-64 bg-white shadow-md dashboard-sidebar z-50 fixed top-0 left-0 h-full transform transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 sm:block`}
        style={{ maxWidth: '16rem' }}
      >
        {/* Close button for mobile */}
        <div className="sm:hidden flex justify-end p-4">
          <button onClick={() => setMobileSidebarOpen(false)}><X size={28} /></button>
        </div>
        <div className="p-6 pt-0 sm:pt-6">
          <h1 className="text-xl font-bold text-gray-800">BlogDash</h1>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/dashboard/posts" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 cursor-pointer ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <FileText size={20} className="mr-3" />
            <span>Posts</span>
          </NavLink>
          
          <NavLink 
            to="/dashboard/profile" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 cursor-pointer ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <User size={20} className="mr-3" />
            <span>Profile</span>
          </NavLink>
          
          {/* <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 cursor-pointer ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Settings size={20} className="mr-3" />
            <span>Settings</span>
          </NavLink> */}
          
          <div 
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer"
            onClick={() => window.open('/')}
          >
            <Home size={20} className="mr-3" />
            <span>Home</span>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <div 
            className="flex items-center text-gray-600 hover:bg-gray-50 py-3 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto dashboard-main">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center dashboard-topnav">
          <div className="flex items-center gap-2">
            {/* Hamburger for mobile */}
            <button className="sm:hidden mr-2" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <Notification/>
            <img 
              src={user?.image instanceof File ? URL.createObjectURL(user.image) : (user?.image || "")}
              alt="User Avatar" 
              className="h-8 w-8 rounded-full" 
            />
            <span className="text-gray-600">{ user ? user.fullname: ''}</span>
          </div>
        </div>
        
        {/* Dashboard Content - This is where the child routes will be rendered */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;