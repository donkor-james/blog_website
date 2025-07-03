// // components/profile/ProfileSettings.jsx
// import React, { useState, useEffect } from 'react';
// import { MyContext } from '../Context';

// const Profile = () => {

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [passwordResetError, setPasswordResetError] = useState("");
//   // const [credentials, setCredentials] = useState({
//   //   password: '',
//   //   new_password: '',
//   //   confirm_password: ''
//   // })
//   const {user, access, setUser} = MyContext()

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//      const response = await fetch("http://localhost:8000/api/users/update/", {
//       method: "PUT",
//       body: JSON.stringify(user),
//       headers: {
//         "Authorization": `Bearer ${access}`
//       }
//     })
//   };

//   const handleChangePassword = async (e) =>{
//     e.preventDefault()
//     if (e.target.new_password !== e.target.confirm_password){
//       const credentials = {
//         password: e.target.password.value,
//         new_password: e.target.value,
//         confirm_password: e.target.value
//       }
//     }
//     const response = await fetch("http://localhost:8000/api/users/reset-password/", {
//       method: "PUT",
//       body: JSON.stringify(credentials),
//       headers: {
//         "Authorization": `Bearer ${access}`,
//       }
//     })
    
//     if(response.ok){
//       // const data = response.json()
//       alert("password changed successfully")
//     }else if (response.status === 401){
//       navigator("/login")
//     }else if (response.status === 400){
//     }
//   }

//   return (
//     <div>
//       {message.text && (
//         <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           {message.text}
//         </div>
//       )}
      
//       <div className="bg-white shadow rounded-lg p-6">
//         <div className="flex flex-col md:flex-row">
//           <div className="md:w-1/3 flex flex-col items-center justify-center mb-6 md:mb-0">
//             <img 
//               src={user.avatar} 
//               alt="Profile" 
//               className="h-32 w-32 rounded-full mb-4" 
//             />
//             <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
//               Change Avatar
//             </button>
//           </div>
//           <div className="md:w-2/3">
//             <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>
//                 <input 
//                   type="text" 
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={user.name}
//                   onChange={(e) => setUser({...user, name: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input 
//                   type="email" 
//                   className="w-full p-2 border border-gray-300 rounded"
//                   value={user.email}
//                   onChange={(e) => setUser({...user, email: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Biography
//                 </label>
//                 <textarea 
//                   className="w-full p-2 border border-gray-300 rounded h-32"
//                   value={user.bio}
//                   onChange={(e) => setUser({...user, bio: e.target.value})}
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button 
//                   type="submit" 
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
//                   disabled={loading}
//                 >
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white shadow rounded-lg p-6 mt-6">
//         <h3 className="text-xl font-semibold mb-6">Account Security</h3>
//         <form className="space-y-4" onSubmit={handleChangePassword}>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Current Password
//             </label>
//             <input 
//               type="password"
//               name="password" 
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>
//             <input 
//               type="password"
//               name='new_password'
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm New Password
//             </label>
//             <input 
//               type="password"
//               name='confirm_password' 
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div className="flex justify-end">
//             <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Update Password
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;