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

    const { access, categories } = MyContext()
    const [loading, setLoading] = useState(false);
    const [savedStatus, setSavedStatus] = useState(null); // null, 'saving', 'saved', 'error'
    const [previewMode, setPreviewMode] = useState(false);
    const [message, setMessage] = useState(null)
    // const [error, setError] = useState(null)
    //   const [tagInput, setTagInput] = useState('');

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

    // Handle tag input
    //   const handleTagAdd = (e) => {
    //     e.preventDefault();
    //     if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
    //       setPostData({
    //         ...postData,
    //         tags: [...postData.tags, tagInput.trim()]
    //       });
    //       setTagInput('');
    //     }
    //   };

    // Handle tag removal
    //   const handleTagRemove = (tagToRemove) => {
    //     setPostData({
    //       ...postData,
    //       tags: postData.tags.filter(tag => tag !== tagToRemove)
    //     });
    //   };

    // Handle image upload
    const handleImageUpload = (e) => {
        // e.preventDefault()
        // In a real app, this would upload to a server
        // For now, we'll use a placeholder image
        setPostData({
            ...postData,
            coverImage: e.target.files[0]
        });
        
        // console.log(e.target.files[0], 'inside data')
    };

    // Handle save
    //   const handleSave = (status = postData.status) => {
    //     setSavedStatus('saving');

    //     // Update status if it's being published
    //     const updatedData = {
    //       ...postData,
    //       status
    //     };

    //     // Simulate API call
    //     // setTimeout(() => {
    //     //   console.log('Creating new post:', updatedData);
    //     //   setSavedStatus('saved');

    //     //   // Reset save status after a few seconds
    //     //   setTimeout(() => {
    //     //     setSavedStatus(null);
    //     //   }, 3000);

    //     //   // Optionally redirect on publish
    //     //   if (status === 'published') {
    //     //     // navigate('/dashboard');
    //     //   }
    //     // }, 1500);
    //   };

    const handleSave = (e) => {
        e.preventDefault()

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // const { title, coverImage, content, category} = {...postData}
        

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
                    formData.append('coverImage', postData.coverImage); // Append the image file
                }
                console.log(access, "acesss")
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
                    // setPostData({
                    //     title: '',
                    //     coverImage: null,
                    //     content: '',
                    //     category: '',
                    // })

                    alert('Post created successfully')
                    // navigate('/dashboard/posts')
                } else if (response.status === 401) {
                    // refresh token
                    navigate('/login')
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

                                {/* {savedStatus === 'saved' && (
                        <span className="text-green-600 text-sm flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Saved
                        </span>
                    )} */}

                                {/* Draft Button */}
                                {/* <button
                        onClick={() => handleSave('draft')}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Save Draft
                    </button> */}

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
                    {/* {error &&
                        <small className='text-red-600 text-center'> {error} </small>
                    } */}
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

                                    {/* Cover Image Section */}
                                    <div className="p-6 border-b bg-gray-50">
                                        {postData.coverImage ? (
                                            <div className="relative">
                                                {console.log(postData.coverImage, 'displaying path')}
                                                <img
                                                    src={URL.createObjectURL(postData.coverImage)}
                                                    alt="Cover"
                                                    className="w-full h-64 object-cover rounded"
                                                />
                                                <button
                                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                                    onClick={() => setPostData({ ...postData, coverImage: null })}
                                                >
                                                    <X className="h-5 w-5 text-gray-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div
                                                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-100"
                                                //   onClick={handleImageUpload}
                                                >
                                                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="mt-4 flex text-sm text-gray-600 justify-center">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                            <span>Upload a cover image</span>
                                                            <input
                                                                type="file"
                                                                className="sr-only"
                                                                required
                                                                onChange={handleImageUpload}
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                                {error.coverImage && 
                                                    <p className='text-red-600'>   
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
                                        {/* <div>
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
                        </div> */}

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
                                                {/* {console.log(categories[0].name)} */}
                                            </select>
                                            {error.category && 
                                                <p className='text-red-600'>   
                                                    {error.category} 
                                                </p>
                                            }
                                        </div>

                                        {/* Excerpt */}
                                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Excerpt
                            </label>
                            <textarea
                            name="excerpt"
                            value={postData.excerpt}
                            onChange={handleChange}
                            placeholder="Brief summary of your post"
                            className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                            ></textarea>
                        </div> */}

                                        {/* Tags */}
                                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                            </label>
                            <div className="flex flex-wrap mb-2">
                            {postData.tags.map(tag => (
                                <span 
                                key={tag} 
                                className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center"
                                >
                                {tag}
                                <button
                                    onClick={() => handleTagRemove(tag)}
                                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                </span>
                            ))}
                            </div>
                            <form onSubmit={handleTagAdd} className="flex">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-l-md"
                                placeholder="Add a tag"
                            />
                            <button
                                type="submit"
                                className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-gray-700 hover:bg-gray-200"
                            >
                                <Tag className="h-4 w-4" />
                            </button>
                            </form>
                        </div> */}

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

                                {/* SEO Settings (optional section) */}
                                {/* <div className="bg-white rounded-lg shadow">
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
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="SEO Title (defaults to post title)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Description
                            </label>
                            <textarea
                            name="metaDescription"
                            className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                            placeholder="SEO Description (defaults to excerpt)"
                            ></textarea>
                        </div>
                        </div>
                    </div> */}
                            </div>
                        </div>
                    </div>
                </main>
            </form>
        </div>
    );
};

export default CreatePost;