// components/layout/DashboardLayout.jsx - Layout component with navigation
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Home, Settings, FileText, User, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '/api/placeholder/150/150'
  });
  
  // Get the current active route to set the title
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.includes('/posts')) return 'Manage Posts';
    if (path.includes('/profile')) return 'User Profile';
    if (path.includes('/settings')) return 'App Settings';
    return 'Dashboard';
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
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
          
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center px-6 py-3 cursor-pointer ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Settings size={20} className="mr-3" />
            <span>Settings</span>
          </NavLink>
          
          <div 
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer"
            onClick={() => window.open('/', '_blank')}
          >
            <Home size={20} className="mr-3" />
            <span>Visit Blog</span>
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <div 
            className="flex items-center text-gray-600 hover:bg-gray-50 py-3 cursor-pointer"
            onClick={() => navigate('/logout')}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="h-8 w-8 rounded-full" 
            />
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