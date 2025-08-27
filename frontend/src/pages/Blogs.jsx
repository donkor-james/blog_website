import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { MyContext } from '../Context';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const { categories } = MyContext();
  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPaginatedPosts = async (url = 'http://localhost:8000/api/blog/posts/') => {
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setPosts(data.results);
    setNext(data.next);
    setPrevious(data.previous);
    setLoading(false);
  };

  const fetchCategoryPosts = async (categoryId, url) => {
    setLoading(true);
    const endpoint = url || `http://localhost:8000/api/blog/category/${categoryId}/posts/`;
    const response = await fetch(endpoint);
    const data = await response.json();
    setPosts(data.results);
    setNext(data.next);
    setPrevious(data.previous);
    setLoading(false);
  };

  useEffect(() => {
    fetchPaginatedPosts();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      fetchPaginatedPosts();
    } else {
      fetchCategoryPosts(category);
    }
  };

  const handlePageChange = (url) => {
    if (selectedCategory === 'All') {
      fetchPaginatedPosts(url);
    } else {
      fetchCategoryPosts(selectedCategory, url);
    }
  };

  // Search filter
  const filteredPosts = searchQuery
    ? posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

  return (
    <div className='bg-gray-50'>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 flex flex-col md:flex-row max-w-6xl mx-auto px-4">
        <div className="relative md:w-1/4 p-4 md:block hidden">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="flex flex-col space-y-2">
            <button
              key="all"
              onClick={() => handleCategorySelect('All')}
              className={`px-3 py-2 text-left rounded-md font-medium ${selectedCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories && categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-3 py-2 text-left rounded-md font-medium ${selectedCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden overflow-x-auto whitespace-nowrap flex space-x-4 p-4 scrollbar-hide">
          <button
            key="all"
            onClick={() => handleCategorySelect('All')}
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All
          </button>
          {categories && categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 rounded-md font-medium ${selectedCategory === category.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex-1 md:ml-14">
          <div className="mb-6 flex items-center border rounded-lg overflow-hidden shadow-sm">
            <Search className="h-5 w-5 text-gray-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-3 py-2 outline-none"
            />
          </div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredPosts && filteredPosts.map(post => (
                <div key={post.id} className="bg-white flex shadow-sm rounded-lg overflow-hidden hover:shadow-md transition">
                  <img src={post.coverImage} alt={post.title} className="w-40 object-cover" />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-sm text-gray-5 mb-2">
                        <span className="text-sm mr-2 text-gray-500 italic">Author: {post.author.name || "Unknown"}</span>
                        <span className="text-sm mr-2 text-gray-500"> published: {post.created_at}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {post.content}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link to={`/blogs/postDetail/${post.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cursor Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            <button className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50" disabled={!previous} onClick={() => handlePageChange(previous)}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50" disabled={!next} onClick={() => handlePageChange(next)}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
