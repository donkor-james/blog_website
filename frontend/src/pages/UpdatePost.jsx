import React, { useState, useEffect } from 'react';
import { ArrowLeft, ImagePlus, Tag, Calendar, Save, Check, X, EyeIcon, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // State for post data
  const [postData, setPostData] = useState({
    title: '',
    coverImage: null,
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft'
  });
  
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState(null); // null, 'saving', 'saved', 'error'
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  // Fetch post data for edit mode
  useEffect(() => {
    if (postId) {
      setLoading(true);
      // Simulate API call to fetch post data
      setTimeout(() => {
        // This would be an API call in a real application
        // fetchPost(postId).then(data => setPostData(data))
        setPostData({
          title: 'Mastering Tailwind CSS',
          coverImage: '/api/placeholder/1200/600',
          content: `# Mastering Tailwind CSS

Tailwind CSS has revolutionized the way developers approach styling in web applications. In this comprehensive guide, we'll explore best practices and advanced techniques.

## Why Tailwind?

Tailwind provides a utility-first approach that allows for rapid UI development without leaving your HTML. Unlike traditional CSS frameworks, Tailwind doesn't provide pre-built components that you need to customize. Instead, it gives you utility classes that you can combine to build completely custom designs.

## Getting Started

To start using Tailwind, you'll need to install it via npm:

\`\`\`
npm install tailwindcss
\`\`\`

Then, you'll need to create a configuration file:

\`\`\`
npx tailwindcss init
\`\`\`

## Advanced Techniques

### Custom Utilities

You can create your own utility classes by extending the Tailwind configuration:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      }
    }
  }
}
\`\`\`

### Responsive Design

Tailwind makes it easy to create responsive designs using breakpoint prefixes:

\`\`\`html
<div class="text-center sm:text-left md:text-right lg:text-justify">
  This text aligns differently at different screen sizes.
</div>
\`\`\`

## Conclusion

Tailwind CSS provides a powerful framework for creating custom designs without writing custom CSS. By embracing its utility-first approach, you can build modern interfaces more efficiently.`,
          excerpt: 'Learn how to leverage the full power of Tailwind CSS in your projects with these advanced techniques and best practices.',
          category: 'Development',
          tags: ['CSS', 'Frontend', 'Web Development'],
          status: 'draft'
        });
        setLoading(false);
      }, 800);
    }
  }, [postId]);
  
  // Handle content change
  const handleContentChange = (e) => {
    setPostData({
      ...postData,
      content: e.target.value
    });
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value
    });
  };
  
  // Handle tag input
  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData({
        ...postData,
        tags: [...postData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Handle tag removal
  const handleTagRemove = (tagToRemove) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    // In a real app, this would upload to a server
    // For now, we'll use a placeholder image
    setPostData({
      ...postData,
      coverImage: '/api/placeholder/1200/600'
    });
  };
  
  // Handle save
  const handleUpdate = (status = postData.status) => {
    setSavedStatus('saving');
    
    // Update status if it's being published
    const updatedData = {
      ...postData,
      status
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log('Updating post:', updatedData);
      setSavedStatus('saved');
      
      // Reset save status after a few seconds
      setTimeout(() => {
        setSavedStatus(null);
      }, 3000);
      
      // Optionally redirect on publish
      if (status === 'published') {
        // navigate('/dashboard');
      }
    }, 1500);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-medium text-gray-900">
                Edit Post
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Toggle Preview Button */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1.5 rounded text-sm font-medium ${
                  previewMode 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Preview
                </div>
              </button>
              
              {/* Save Status Indicator */}
              {savedStatus === 'saving' && (
                <span className="text-gray-500 text-sm flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-1" />
                  Saving...
                </span>
              )}
              
              {savedStatus === 'saved' && (
                <span className="text-green-600 text-sm flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Saved
                </span>
              )}
              
              {/* Draft Button */}
              <button
                onClick={() => handleUpdate('draft')}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Save Draft
              </button>
              
              {/* Update Button */}
              <button
                onClick={() => handleUpdate('published')}
                className="px-4 py-1.5 bg-indigo-600 rounded text-sm font-medium text-white hover:bg-indigo-700 flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                {postData.status === 'published' ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Editor */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Post ID Display */}
                <div className="px-6 pt-4 pb-2 bg-gray-50 border-b">
                  <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-gray-600 bg-gray-200">
                    Post ID: {postId}
                  </span>
                </div>
                
                {/* Title Input */}
                <div className="p-6 border-b">
                  <input
                    type="text"
                    name="title"
                    value={postData.title}
                    onChange={handleChange}
                    placeholder="Post title"
                    className="w-full text-3xl font-bold focus:outline-none"
                  />
                </div>
                
                {/* Cover Image Section */}
                <div className="p-6 border-b bg-gray-50">
                  {postData.coverImage ? (
                    <div className="relative">
                      <img 
                        src={postData.coverImage} 
                        alt="Cover" 
                        className="w-full h-64 object-cover rounded"
                      />
                      <button 
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                        onClick={() => setPostData({...postData, coverImage: null})}
                      >
                        <X className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-100"
                      onClick={handleImageUpload}
                    >
                      <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Upload a cover image</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
                
                {/* Content Editor */}
                <div className="p-6">
                  {previewMode ? (
                    <div className="prose max-w-none">
                      {/* In a real app, you would render Markdown here */}
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <h2 className="text-lg font-semibold text-gray-500 mb-2">Markdown Preview</h2>
                        <div className="whitespace-pre-wrap">
                          {postData.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={postData.content}
                      onChange={handleContentChange}
                      placeholder="Start writing your post content here... Markdown is supported."
                      className="w-full h-96 focus:outline-none resize-none"
                    ></textarea>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar Settings */}
            <div className="lg:w-1/3">
              {/* Post History */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-4 py-5 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Post History
                  </h3>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-600">
                    <p>Created: <span className="font-medium">March 15, 2025</span></p>
                    <p>Last updated: <span className="font-medium">March 19, 2025</span></p>
                    <p>Published: <span className="font-medium">{postData.status === 'published' ? 'Yes' : 'No (Draft)'}</span></p>
                  </div>
                </div>
              </div>
            
              {/* Publish Settings */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-4 py-5 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Publish Settings
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={postData.status}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={postData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a category</option>
                      <option value="Technology">Technology</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Writing">Writing</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  
                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excerpt
                    </label>
                    <textarea
                      name="excerpt"
                      value={postData.excerpt}
                      onChange={handleChange}
                      placeholder="Write a short excerpt for your post..."
                      className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      Excerpts are used in post lists and SEO descriptions.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-4 py-5 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tags
                  </h3>
                </div>
                <div className="p-4">
                  <form onSubmit={handleTagAdd} className="flex mb-3">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </form>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postData.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {postData.tags.length === 0 && (
                      <p className="text-sm text-gray-500">No tags added yet.</p>
                    )}
                  </div>
                  
                  <p className="mt-3 text-xs text-gray-500">
                    Tags help users find related content.
                  </p>
                </div>
              </div>
              
              {/* SEO Settings */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    SEO Settings
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      placeholder="SEO title (defaults to post title)"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      placeholder="SEO description (defaults to excerpt)"
                      className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      name="canonicalUrl"
                      placeholder="https://example.com/original-post-url"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Use this for duplicate content to specify the original URL.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdatePost;