// components/profile/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { MyContext } from '../Context';

const DashboardProfile = () => {
  // const [user, setUser] = useState({
  //   name: 'Alex Johnson',
  //   email: 'alex@example.com',
  //   bio: 'Frontend developer passionate about React and modern web technologies.',
  //   joinDate: 'January 2024',
  //   avatar: '/api/placeholder/150/150'
  // });

  const { user, setUser } = MyContext()
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  return (
    <div>
      {message.text && (
        <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex flex-col items-center  mb-6 md:mb-0">
            <img 
              src={user ? user.image: null} 
              alt="Profile" 
              className="md:h-40 md:w-40 w-24 h-24 rounded-full mb-4" 
            />
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
              Change Avatar
            </button>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user ? user.fullname: null}
                  onChange={(e) => setUser({...user, fullname: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={ user ? user.email: null}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biography
                </label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded h-32"
                  value={ user ? user.bio: null}
                  onChange={(e) => setUser({...user, bio: e.target.value})}
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-6">Account Security</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardProfile;