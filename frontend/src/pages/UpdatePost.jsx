import React, { useState, useEffect } from 'react';
import { ArrowLeft, ImagePlus, Tag, Calendar, Save, Check, X, EyeIcon, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MyContext } from '../Context';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { access, categories, userPosts, userLogout, refreshAccessToken} = MyContext()
  
  // State for post data
  const [postData, setPostData] = useState({
    title: '',
    coverImage: null,
    content: '',
    category: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({type: '', text: ''});
  const [savedStatus, setSavedStatus] = useState(null); // null, 'saving', 'saved', 'error'
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState({
        title: '',
        coverImage: null,
        content: '',
        category: '',
    });

  useEffect(() => {
    if (userPosts && postId) {
      console.log('Fetching post data for ID:', userPosts);
      const postToEdit = userPosts.find(post => post.id == postId);
      console.log('Fetching:', postToEdit);
      if (postToEdit !== undefined) {
        setPostData({
          title: postToEdit.title || '',
          coverImage: postToEdit.coverImage || null,
          content: postToEdit.content || '',
          category: postToEdit.category || '',
        });
        setLoading(false);
        console.log(postData, "postdata")
      }
    }
  }, [userPosts]);
  
      const [isDragOver, setIsDragOver] = useState(false);
  
      // Validate file type and size
      const validateFile = (file) => {
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
          const maxSize = 10 * 1024 * 1024; // 10MB
  
          if (!allowedTypes.includes(file.type)) {
              setError({
                  ...error,
                  coverImage: 'Please select a valid image file (JPG, PNG, GIF)'
              });
              return false;
          }
  
          if (file.size > maxSize) {
              setError({
                  ...error,
                  coverImage: 'File size must be less than 10MB'
              });
              return false;
          }
  
          return true;
      };
  

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file && validateFile(file)) {
          setPostData({
              ...postData,
              coverImage: file
          });
          setError({
              ...error,
              coverImage: ''
          });
      }
  };

    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                setPostData({
                    ...postData,
                    coverImage: file
                });
                setError({
                    ...error,
                    coverImage: ''
                });
            }
        }
    };

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
  // const handleImageUpload = (e) => {
  //   // In a real app, this would upload to a server
  //   // For now, we'll use a placeholder image
  //   setPostData({
  //     ...postData,
  //     coverImage: '/api/placeholder/1200/600'
  //   });
  // };
  
  // Handle save
    // Update status if it's being published
    
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
          const isEmpty = Object.values(postData).some(value => value === '' || null)
          if (isEmpty) {
                if(!postData.title){
                    error.title = 'Title is required'
                }
                if(!postData.content){
                    error.content = 'Content is required'
                }
                if(!postData.category){
                  error.category = 'Category is required'
                }
                if(!postData.coverImage){
                  error.coverImage = 'CoverImage is required'
                }
              } else {
                const formData = new FormData();
                formData.append('title', postData.title || "");
                formData.append('content', postData.content || "");
                formData.append('category', postData.category || "");
                  // formData.append('coverImage', postData.coverImage);
                if (postData.coverImage instanceof File) {
                  formData.append('coverImage', postData.coverImage);
                }else{
                      const response = await fetch(postData.coverImage);
                      const blob = await response.blob();
                      const filename = postData.coverImage.split('/').pop();
                      // Convert blob to File object

                      const file = new File([blob], filename, { 
                        type: blob.type,
                        lastModified: Date.now()
                      });
                      console.log(file, "file", filename)
                  formData.append('coverImage', file);
                }

                // }
                console.log(formData, postData, "in update")
                
                console.log(access, "accesss")
                const response = await fetch(`http://localhost:8000/api/blog/posts/update/${postId}/`, {
                    method: "PUT",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${access}`
                    }
                })

                const data = await response.json()
                if (response.ok) {
                    setMessage({type: "success", text: 'Post updated successfully'})
                    // navigate('/dashboard/posts')
                    // alert('Post created successfully')
                } else if (response.status === 401) {
                
                    const new_access = await refreshAccessToken()
                    if (!new_access){
                      userLogout()
                      navigate('/login')
                    }else{
                      // Retry the request with the new access token
                      const retryResponse = await fetch(`http://localhost:8000/api/blog/posts/update/${postId}/`, {
                        method: "PUT",
                        body: formData,
                        headers: {
                          "Authorization": `Bearer ${new_access}`
                        }
                      });
                      const retryData = await retryResponse.json();
                      if (retryResponse.ok) {
                        setMessage({type: "success", text: 'Post updated successfully'});
                      } else {
                        userLogout()
                        navigate('/login')
                      }
                    }
                } else if(response.status === 400) {
                    setError("All fields are required")
                }else{
                    setError("Something went wrong, try again later")
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

  
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
      {message.text && (
        <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      {/* Editor Header */}
      <form onSubmit={handleUpdate}>
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
                {/* <button
                  onClick={() => handleUpdate('draft')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Save Draft
                </button> */}
                
                {/* Update Button */}
                <button
                  type='submit'
                  onClick={handleUpdate}
                  className="px-4 py-1.5 bg-indigo-600 rounded text-sm font-medium text-white hover:bg-indigo-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {/* {postData.status === 'published' ? 'Update' : 'Publish'} */}
                  publish
                </button>
              </div>
            </div>
          </div>
        </header>
      </form>
      
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
                                src={postData?.coverImage instanceof File ? URL.createObjectURL(postData.coverImage) : (postData?.coverImage || "")}
                                alt="Cover"
                                className="w-full h-64 object-cover rounded"
                            />
                            <button
                                type="button"
                                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                onClick={() => setPostData({ ...postData, coverImage: null })}
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div
                                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                                    isDragOver 
                                        ? 'border-indigo-400 bg-indigo-50' 
                                        : 'border-gray-300 hover:bg-gray-100'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <ImagePlus className={`mx-auto h-12 w-12 ${
                                    isDragOver ? 'text-indigo-500' : 'text-gray-400'
                                }`} />
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
                                {isDragOver && (
                                    <p className="text-sm text-indigo-600 mt-2 font-medium">
                                        Drop your image here!
                                    </p>
                                )}
                            </div>
                            {error.coverImage && 
                                <p className='text-red-600 mt-2'>   
                                   {error.coverImage} 
                                </p>
                            }
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
                {/* Publish Settings */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="px-4 py-5 border-b mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                            Publish Settings
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>                         
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={postData.category}
                                required
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a category</option>
                                {categories && categories.map( category => (
                                    <option key={category.id} value={`${category.id}`}>{ category.name }</option>
                                ))}
                            </select>
                            {error.category && 
                                <p className='text-red-600'>   
                                    {error.category} 
                                </p>
                            }
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Publication Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    readOnly
                                    className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
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