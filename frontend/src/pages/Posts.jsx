import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../Context';

const PostsManagement = () => {

  const [userPosts, setUserPosts] = useState([])
  const navigate = useNavigate()
  const {user, access, userLogout, refreshAccessToken, isAuthenticated, setIsAuthenticated} = MyContext()

  // console.log(userPosts, "post")

  useEffect( () =>{
    fetchUserPosts()
  },
  [])

    const fetchUserPosts = async () =>{
        try{
          const response = await fetch(`http://localhost:8000/api/blog/user-posts/`, {
            method: "GET",
            headers:{
              "Authorization": `Bearer ${localStorage.getItem('access')}`,
              "Content-Type": "application/json"
            }
          })
      
          if (response.ok){
            const new_data = await response.json()
            console.log(new_data)
            setUserPosts(new_data)
          }else if(response.status === 401){
            const new_access = await refreshAccessToken()
            if (new_access){ 
                const new_response = await fetch(`http://localhost:8000/api/blog/user-posts/`, {
                method: "GET",
                headers:{
                  "Authorization": `Bearer ${new_access}`,
                  "Content-Type": "application/json"
                }
              })
              if (new_response.ok){
                const new_data = await new_response.json()
                console.log(new_data)
                setUserPosts(new_data)
              }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
              }
            }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
            }
          }
        }catch(error){
            console.log(error)
        }
      } 

  const deletePost = async (id) => {
    // e.preventDefault()
    // id = e.target
    console.log(id)
    try{
      // setPosts(posts.filter(post => post.id != id));
      const response = await fetch(`http://localhost:8000/api/blog/posts/delete/${id}/`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`
      }})
  
      if (response.ok){
        alert("Post deleted successfully")
        // Remove the deleted post from the userPosts state
        setUserPosts(userPosts.filter(post => post.id !== id));
      } else if (response.status === 401) {
        const new_access = await refreshAccessToken()
        if(new_access){
          const retryResponse = await fetch(`http://localhost:8000/api/blog/posts/delete/${id}/`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${new_access}`
          }
          });
          const retryData = await retryResponse.json();
          if (retryResponse.ok) {
              // setMessage('Post created successfully');
              // addUserPost();
              // navigate('/dashboard/posts');
            // setMessage({text: "Profile updated successfully!", type: 'success'});
            alert("Post deleted successfully")
          } else {
              userLogout()
              navigate('/login');
            }
        }else{
          userLogout();
          navigate("/login");
        }
      }
    }catch(e){
      console.log(e)
      alert("Something went wrong, try again later")
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Posts</h3>
        <Link to="/dashboard/posts/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Post
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 text-sm">Total Posts</h4>
          <p className="text-2xl font-bold">{userPosts ? userPosts.length : 0}</p>
        </div>
        {/* <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 text-sm">Published</h4>
          <p className="text-2xl font-bold">{posts.filter(post => post.status === 'published').length}</p>
        </div> */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 text-sm">Total Reactions</h4>
          <p className="text-2xl font-bold">{ userPosts.length > 0 ? userPosts.reduce((sum, post) => sum + post.reactions.total, 0): "0"}</p>
        </div>
      </div>
      
      {/* Posts Table */}
      <div>
        {
          userPosts ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No_Of_Reaction</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userPosts.map(post => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link to={`/dashboard/posts/update/${post.id}`} className="hover:text-blue-600">
                          {post.title}
                        </Link>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{post.created_at}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.reactions.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className='flex justify-end items-right'>          
                        <Link to={`/dashboard/posts/update/${post.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          <Edit size={18} />
                        </Link>
                        <span
                          className="text-red-600 hover:text-red-900"
                          onClick={ () => deletePost(post.id)}
                        >
                          <Trash2 size={18} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ):<div className='font-semibold mt-12 text-4xl text-gray-700'>
              No posts to show 
            </div>
          }
      </div>
    </div>
  );
};

export default PostsManagement;