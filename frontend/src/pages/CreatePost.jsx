import React, { useState } from 'react';
import { ArrowLeft, ImagePlus, Tag, Calendar, Save, Check, X, EyeIcon, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../Context';

const CreatePost = () => {
    const navigate = useNavigate();

    // State for post data
    const [postData, setPostData] = useState({
        title: '',
        coverImage: null,
        content: '',
        category: '',
    });

    const [error, setError] = useState({
        title: '',
        coverImage: null,
        content: '',
        category: '',
    });

    const { access, categories, addUserPost, userLogout, refreshAccessToken} = MyContext()
    const [loading, setLoading] = useState(false);
    const [savedStatus, setSavedStatus] = useState(null); // null, 'saving', 'saved', 'error'
    const [previewMode, setPreviewMode] = useState(false);
    const [message, setMessage] = useState(null);
    
    // Drag and drop states
    const [isDragOver, setIsDragOver] = useState(false);

    // Handle content change
    const handleContentChange = (e) => {
        setPostData({
            ...postData,
            content: e.target.value
        });
        setError({
            ...error,
            content: ''
        })
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData({
            ...postData,
            [name]: value
        });

        setError({
            ...error,
            [name]: ''
        })
    };

    
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

    // Handle image upload
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

    const handleSave = (e) => {
        e.preventDefault()
    }

    const handleSubmit = async (e) => {
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
                formData.append('title', postData.title);
                formData.append('content', postData.content);
                formData.append('category', postData.category);
                if (postData.coverImage) {
                    formData.append('coverImage', postData.coverImage);
                }
                
                console.log(access, "accesss")
                const response = await fetch('http://localhost:8000/api/blog/posts/new/', {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${access}`
                    }
                })

                const data = await response.json()
                if (response.ok) {
                    setMessage('Post created successfully')
                    addUserPost()
                    navigate('/dashboard/posts')
                    alert('Post created successfully')
                } else if (response.status === 401) {
                    // If unauthorized, refresh the access token and retry
                    const new_access = await refreshAccessToken();
                    if (new_access) {
                        // Retry the request with the new access token
                        const retryResponse = await fetch('http://localhost:8000/api/blog/posts/new/', {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${new_access}`
                            }
                        });
                        const retryData = await retryResponse.json();
                        if (retryResponse.ok) {
                            setMessage('Post created successfully');
                            addUserPost();
                            navigate('/dashboard/posts');
                            alert('Post created successfully');
                        } else {
                            userLogout()
                            navigate('/login');
                        }
                    }else{
                        userLogout()
                        navigate('/login')
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

    return (
        <div className="min-h-screen bg-gray-50">
            <form action="" onSubmit={handleSubmit}>
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
                                    Create New Post
                                </h1>
                            </div>

                            <div className="flex items-center space-x-3">
                                {/* Toggle Preview Button */}
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`px-3 py-1.5 rounded text-sm font-medium ${previewMode
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

                                {/* Publish Button */}
                                <button
                                    onClick={handleSubmit}
                                    type='submit'
                                    className="px-4 py-1.5 bg-indigo-600 rounded text-sm font-medium text-white hover:bg-indigo-700 flex items-center"
                                >
                                    <Save className="h-4 w-4 mr-1" />
                                    Publish
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
                                        {error.title && <div className='text-red-600'>{error.title}</div>}
                                    </div>

                                    {/* Cover Image Section with Drag & Drop */}
                                    <div className="p-6 border-b bg-gray-50">
                                        {postData.coverImage ? (
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(postData.coverImage)}
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
                                                <div className="p-4 bg-gray-50 rounded-lg border">
                                                    <h2 className="text-lg font-semibold text-gray-500 mb-2">Markdown Preview</h2>
                                                    <div className="whitespace-pre-wrap">
                                                        {postData.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <textarea
                                                    value={postData.content}
                                                    required
                                                    onChange={handleContentChange}
                                                    placeholder="Start writing your post content here... Markdown is supported."
                                                    className="w-full h-96 focus:outline-none resize-none"
                                                ></textarea>
                                                {error.content && 
                                                    <p className='text-red-600'>   
                                                       {error.content} 
                                                    </p>
                                                }
                                            </div>
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
            </form>
        </div>
    );
};

export default CreatePost;