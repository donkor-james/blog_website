import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, Lightbulb, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MyContext } from '../Context';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, access, refreshAccessToken, userLogout} = MyContext()
  // const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [reactions, setReactions] = useState(["LIKE", "LOVE", "DISLIKE"]);

  useEffect(() => {
    // const foundPost = posts && posts.find((post) => post.id === parseInt(id)); // Convert id to a number
    // setPost(foundPost);
    fetchPost()
  }, [posts]);

  const fetchPost = async () =>{
        const response = await fetch( `http://localhost:8000/api/blog/posts/get/${id}/`,{
      headers:{
        "Content-type": "application/json",
        "Authorization": `Bearer ${access}`
      }
    })
    if (response.ok){
      const data = await response.json()
      setPost(data)
      posts && setRelatedPosts(posts.filter(filterPost => filterPost.category === data.category && filterPost.id != id));
      // console.log(posts[0], "post related")
    }else if (response.status === 401){
      await refreshAccessToken()
      const retryResponse = await fetch( `http://localhost:8000/api/blog/posts/get/${id}/`,{
      headers:{
        "Content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`
      }
    })
    if (retryResponse.ok){
      const data = await retryResponse.json()
      setPost(data)
      posts && setRelatedPosts(posts.filter(filterPost => filterPost.category === data.category));

    }else{
      userLogout()
      navigate('/login')
    }
  }
  }

  const handleReaction = async (type) => {
    const response = await fetch(`http://localhost:8000/api/blog/posts/${post.id}/react/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}` // Uncomment if you have an access token
      },
      body: JSON.stringify({ "reaction_type": type })
    })

    if (response.ok) {
      const data = await response.json();
      console.log('Reaction successful:', data);
      setPost(data.post); // Update the post with the new reaction data

      // Update the reaction count for the specific type
      // post.reactions.counts[type] += 1; // Increment the count for the specific reaction type
      // setReactions(prev => ({ ...prev, [type]: data.count }));
    }else if(response.status === 401){
      // If unauthorized, refresh the access token
      const new_access = await refreshAccessToken();
      // Retry the reaction after refreshing the token
      const retryResponse = await fetch(`http://localhost:8000/api/blog/posts/${post.id}/react/`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${new_access}` // Use the refreshed access token
        },
        body: JSON.stringify({ reaction_type: type })
      });
      if (retryResponse.ok) {
        // const data = await retryResponse.json();
        post.reactions.counts[type] += 1; // Increment the count for the specific reaction type
      } else {
        userLogout(); // Call userLogout if still unauthorized
        navigate('/login'); // Redirect to login if still unauthorized
        // console.error('Failed to react after refreshing token');
      }
    }else{
      alert("Something went wrong, please try again later.");
      console.error('Failed to react:', response.statusText);
    }
    // setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  console.log(post)

  if (!post) return <div className='text-center py-20'>Loading...</div>;

  return (
    <div>
      {post &&
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <div className="w-full h-80 bg-cover bg-center relative" style={{ backgroundImage: `url(${post && post.coverImage})` }}>
            <div className="absolute top-4 left-4">
              <button onClick={() => navigate('/blogs')} className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Blogs
              </button>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-4">{post.date} • {post.readTime} read</p>
            
            <div className="mb-6 flex space-x-4">
              <button onClick={() => handleReaction('LIKE')} className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <ThumbsUp className="h-5 w-5 mr-2 text-blue-600" /> {post.reactions.counts.LIKE}
              </button>
              <button onClick={() => handleReaction('LOVE')} className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <Heart className="h-5 w-5 mr-2 text-red-600" /> {post.reactions.counts.LOVE}
              </button>
              <button onClick={() => handleReaction('DISLIKE')} className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" /> {post.reactions.counts.DISLIKE}
              </button>
            </div>
            
            <div className="prose lg:prose-lg max-w-none">{post.content}</div>
            
            <h3 className="text-2xl font-semibold mt-10">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {relatedPosts && relatedPosts.map(rp => (
                <div key={rp.id} className="bg-white shadow-sm rounded-lg overflow-hidden cursor-pointer hover:shadow-md" onClick={() => navigate(`/blog/${rp.id}`)}>
                  <img src={rp.coverImage} alt={rp.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-900">{rp.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default BlogDetail;
