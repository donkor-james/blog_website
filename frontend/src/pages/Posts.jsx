import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostsManagement = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'Getting Started with React', status: 'published', date: '2025-03-10', views: 245 },
    { id: 2, title: 'Mastering Tailwind CSS', status: 'draft', date: '2025-03-15', views: 0 },
    { id: 3, title: 'Building Modern UIs', status: 'published', date: '2025-03-01', views: 189 }
  ]);

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
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
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 text-sm">Published</h4>
          <p className="text-2xl font-bold">{posts.filter(post => post.status === 'published').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 text-sm">Total Views</h4>
          <p className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.views, 0)}</p>
        </div>
      </div>
      
      {/* Posts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map(post => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    <Link to={`/dashboard/posts/${post.id}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/dashboard/posts/update/${post.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit size={18} />
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsManagement;