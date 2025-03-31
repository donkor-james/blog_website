import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, Lightbulb, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MyContext } from '../Context';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts} = MyContext()
  // const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [reactions, setReactions] = useState({ like: 0, love: 0, insightful: 0 });

  useEffect(() => {
    const foundPost = posts && posts.find((post) => post.id === parseInt(id)); // Convert id to a number
    setPost(foundPost);

    setRelatedPosts([
      { id: '2', title: 'The Future of React in 2025', coverImage: '/api/placeholder/400/200' },
      { id: '3', title: 'Designing for Accessibility', coverImage: '/api/placeholder/400/200' }
    ]);
  }, [id, posts]);

  const handleReaction = (type) => {
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  console.log(post)

  if (!post) return <div className='text-center py-20'>Loading...</div>;

  return (
    <div>
      {post &&
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <div className="w-full h-80 bg-cover bg-center relative" style={{ backgroundImage: `url(${post.coverImage})` }}>
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
              <button onClick={() => handleReaction('like')} className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <ThumbsUp className="h-5 w-5 mr-2 text-blue-600" /> {reactions.like}
              </button>
              <button onClick={() => handleReaction('love')} className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <Heart className="h-5 w-5 mr-2 text-red-600" /> {reactions.love}
              </button>
              <button onClick={() => handleReaction('insightful')} className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" /> {reactions.insightful}
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
