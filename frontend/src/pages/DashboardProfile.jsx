// components/profile/ProfileSettings.jsx
import React, { useState, useRef} from 'react';
import { MyContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import { Type } from 'lucide-react';

const DashboardProfile = () => {
  // const [user, setUser] = useState({
  //   name: 'Alex Johnson',
  //   email: 'alex@example.com',
  //   bio: 'Frontend developer passionate about React and modern web technologies.',
  //   joinDate: 'January 2024',
  //   avatar: '/api/placeholder/150/150'
  // });

  const { user, setUser, access, userLogout, refreshAccessToken } = MyContext()
  const [passwordResetData, setPasswordResetData] = useState({
    password: '',
    new_password: "",
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordBtnloading, setPasswordBtnLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(() => (user ? user.image : null))
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordError, setPasswordError] = useState({ type: '', text: '' });
  const navigate = useNavigate()
  const fileInputRef = useRef(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append("first_name", user.first_name || "");
      formData.append("last_name", user.last_name || "");
      formData.append("bio", user.bio || "");
      formData.append("email", user.email || "");
      
      // Only append image if it's a new File object (newly selected)
      if (user.image instanceof File) {
        formData.append("image", user.image);
        console.log('Uploading new image file');
      }
      console.log('formData', formData);
      
      const response = await fetch(`http://localhost:8000/api/users/update/${user.id}/`, {
        method: "PUT",
        body: formData, // ✅ Send formData, not user object
        headers: {
          "Authorization": `Bearer ${access}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Success:', data);
        setMessage({text: "Profile updated successfully!", type: 'success'});
      } else if (response.status === 401) {
        const new_access = await refreshAccessToken()
        if(new_access){
          const retryResponse = await fetch(`http://localhost:8000/api/users/update/${user.id}/`, {
            method: "PUT",
            body: formData,
            headers: {
            "Authorization": `Bearer ${new_access}`
          }
          });
          const retryData = await retryResponse.json();
          if (retryResponse.ok) {
              // setMessage('Post created successfully');
              // addUserPost();
              // navigate('/dashboard/posts');
            setMessage({text: "Profile updated successfully!", type: 'success'});
          } else {
              userLogout()
              navigate('/login');
            }
        }else{
          userLogout();
          navigate("/login");
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setMessage({text: "Something went wrong, try again later", type: 'failed'});
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      // setMessage({ text: "Network error occurred", type: 'error' });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    // Create updated data object
    const updatedData = {
      ...passwordResetData,
      [name]: value
    };
    
    // Update state
    setPasswordResetData(updatedData);
    
    // Validate with the updated data (not the old state)
    passwordValidator(updatedData);
  };

  const passwordValidator = (data) => {
    // Only validate if both password fields have values
    if (data.new_password && data.confirm_password) {
      if (data.new_password === data.confirm_password || data.new_password.startsWith(data.confirm_password)) {
        setPasswordError({ type: "", text: "" });
      } else {
        setPasswordError({ type: 'mismatch', text: "Password does not match" });
      }
    } else {
      // Clear errors if fields are empty
      setPasswordError({ type: "", text: "" });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordResetData.new_password !== passwordResetData.confirm_password) {
      setPasswordError({ type: 'mismatch', text: "Password does not match" });
      return; // Don't proceed with API call
    }
    
    // Ensure all required fields are filled
    if (!passwordResetData.password || !passwordResetData.new_password) {
      setPasswordError({ text: "Please fill in all password fields", type: 'error' });
      return;
    }
    
    setPasswordBtnLoading(true); // Add loading state
    // delete passwordResetData.confirm_password
    console.log(passwordResetData)
    
    try {
      const response = await fetch('http://localhost:8000/api/users/reset-password/', {
        method: "POST",
        body: JSON.stringify(passwordResetData),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        // Clear password form on success
        setPasswordResetData({ password: '', new_password: '', confirm_password: '' });
        setPasswordError({ type: '', text: '' });

      } else if (response.status === 401) {
        userLogout()
        navigate('/login');
      } else if (response.status === 400){
        setPasswordError({ text: data.message || "Something went wrong, try again later", type: 'error' });
      }else{
        setMessage({ text: "Network error. Please try again later.", type: 'error' });
      }
    } catch (error) {
      setMessage({ text: "Network error. Please try again later.", type: 'error' });
    } finally {
      setPasswordBtnLoading(false);
    }
  };

// Helper function to check if password form is valid
const isPasswordFormValid = () => {
  return passwordResetData.password && 
         passwordResetData.new_password && 
         passwordResetData.confirm_password &&
         passwordResetData.new_password === passwordResetData.confirm_password
};

  const handleChange = (e) =>{
    const {name, value, files} = e.target
    setUser({...user,
      name: files.length < 1 ? value: files[0]
    })
  }

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
            src={user?.image instanceof File ? URL.createObjectURL(user.image) : (user?.image || "")}
            alt="Profile"
            className="md:h-40 md:w-40 w-24 h-24 rounded-full mb-4 object-cover" 
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setUser({...user, image: e.target.files[0]})}
            style={{display: 'none'}}
            ref={fileInputRef}
          />
          <button 
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300" 
            onClick={() => fileInputRef.current?.click()}
          >
            Change Avatar
          </button>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user ? user.first_name: null}
                  onChange={(e) => setUser({...user, first_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={user ? user.last_name: null}
                  onChange={(e) => setUser({...user, last_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email"
                  readOnly 
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
        
        {/* Show password error at the top */}
        {passwordError.type !== '' && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {passwordError.text}
          </div>
        )}
        
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input 
              type="text" 
              name="password"
              value={passwordResetData.password}
              onChange={(e) => setPasswordResetData({...passwordResetData, password: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input 
              type="text" 
              name="new_password"
              value={passwordResetData.new_password}
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input 
              type="text" 
              name="confirm_password"
              value={passwordResetData.confirm_password}
              className={`w-full p-2 border rounded ${
                passwordError.type === 'mismatch' 
                  ? 'border-red-500 border-2' 
                  : 'border-gray-300'
              }`}
              onChange={handlePasswordChange}
              required
            />
            {passwordError.type === "mismatch" && (
              <div className='text-red-600 text-sm mt-1'>
                {passwordError.text}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={!isPasswordFormValid() || passwordBtnloading}
              className={`px-4 py-2 rounded transition-colors ${
                !isPasswordFormValid() || passwordBtnloading
                  ? "text-gray-600 bg-gray-300 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {passwordBtnloading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardProfile;