import React, {useEffect, useState} from 'react';
import { BookOpen, TrendingUp, Coffee, Bookmark, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Platform from '../assets/platform.png'
import { MyContext } from '../Context';

// const posts = [

const Home = () => {
  // const [post, setPost] = useState(null)
  const { featuredWriters, FeaturedPosts, posts, categories } = MyContext();




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar/>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2">
            {/* Left side - Animation and Call to Action */}
            <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg inline-block">
                  <p className="text-indigo-200 font-medium">The writers' sanctuary</p>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block">Write.</span>
                  <span className="block text-indigo-300">Connect.</span>
                  <span className="block">Inspire.</span>
                </h1>
                <p className="mt-6 max-w-lg text-xl text-indigo-100">
                  Join a community where ideas evolve and stories find their audience. Discover your voice.
                </p>
                <div className="mt-8 flex space-x-4">
                  <a href="#" className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-indigo-100 hover:bg-indigo-200">
                    Start Writing <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a href="#" className="inline-flex items-center px-5 py-3 border border-white/30 text-base font-medium rounded-md text-white hover:bg-white/10">
                    Explore
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right side - Featured Post Cards in Staggered Layout */}
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute right-10 bottom-10 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-2xl"></div>
              </div>
              
              {/* Post cards in staggered layout */}
              <div className="relative grid grid-cols-12 gap-4 p-4 lg:p-8 h-full">
                <div className="col-span-12 md:col-span-8 md:col-start-5 transform translate-y-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20">
                    <img 
                      src={FeaturedPosts && FeaturedPosts[0]?.coverImage || "/api/placeholder/400/200"} 
                      alt="Featured post" 
                      className="w-full h-32 object-cover" 
                    />
                    <div className="p-4">
                      <span className="text-xs font-medium text-indigo-200 bg-indigo-900/50 px-2 py-1 rounded-full">{FeaturedPosts && categories[(FeaturedPosts[0].category) - 1].name}</span>
                      <h3 className="mt-2 text-lg font-semibold text-white">{FeaturedPosts && FeaturedPosts[0].title}</h3>
                      <div className="mt-4 flex items-center">
                        <img className="h-8 w-8 rounded-full" src={FeaturedPosts && FeaturedPosts[0]?.author_img} alt="Author" />
                        <div className="ml-2 text-sm text-indigo-200">
                          <p className="font-medium">{FeaturedPosts && FeaturedPosts[0].author.name}</p>
                          <p>{FeaturedPosts && FeaturedPosts[0].created_at}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-10 md:col-span-7 md:col-start-2 transform -translate-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20">
                    <img 
                      src={FeaturedPosts && FeaturedPosts[1]?.coverImage || "/api/placeholder/400/200"} 
                      alt="Featured post" 
                      className="w-full h-32 object-cover" 
                    />
                    <div className="p-4">
                      <span className="text-xs font-medium text-indigo-200 bg-indigo-900/50 px-2 py-1 rounded-full">{FeaturedPosts && categories[(FeaturedPosts[1].category) - 1].name}</span>
                      <h3 className="mt-2 text-lg font-semibold text-white">{FeaturedPosts && FeaturedPosts[1].title}</h3>
                      <div className="mt-4 flex items-center">
                        <img className="h-8 w-8 rounded-full" src={FeaturedPosts && FeaturedPosts[1]?.author_img} alt="Author" />
                        <div className="ml-2 text-sm text-indigo-200">
                          <p className="font-medium">{FeaturedPosts && FeaturedPosts[1].author.name}</p>
                          <p>Mar 10 • 8 min read</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-10 md:col-span-7 md:col-start-2 transform -translate-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20">
                    <img 
                      src={FeaturedPosts && FeaturedPosts[2]?.coverImage || "/api/placeholder/400/200"} 
                      alt="Featured post" 
                      className="w-full h-32 object-cover" 
                    />
                    <div className="p-4">
                      <span className="text-xs font-medium text-indigo-200 bg-indigo-900/50 px-2 py-1 rounded-full">{FeaturedPosts && categories[(FeaturedPosts[2].category) - 1].name}</span>
                      <h3 className="mt-2 text-lg font-semibold text-white">{FeaturedPosts && FeaturedPosts[2].title}</h3>
                      <div className="mt-4 flex items-center">
                        <img className="h-8 w-8 rounded-full" src={FeaturedPosts && FeaturedPosts[2]?.author_img} alt="Author" />
                        <div className="ml-2 text-sm text-indigo-200">
                          <p className="font-medium">{FeaturedPosts && FeaturedPosts[2].author.name}</p>
                          <p>Mar 10 • 8 min read</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
          <a href="#" className="text-indigo-600 hover:text-indigo-500 flex items-center text-sm font-medium">
            View all posts <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts && posts.map((post, index) => (
            <div key={index} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={`${post.coverImage}`} alt="Blog post" />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    <a href="#" className="hover:underline">
                      {categories && categories[(post.category) - 1].name}
                    </a>
                  </p>
                  <a href="#" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.content}</p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={post.author_img} alt="Author" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-900">
                      <a href="#" className="hover:underline">
                        {post.author.name}
                      </a>
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime="2020-03-16">{post.created_at}</time>
                      <span aria-hidden="true">&middot;</span>
                      {/* <span>6 min read</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About the Platform */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                A platform built for writers
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                WriteSpace provides everything you need to grow your audience and connect with readers around the world.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: <TrendingUp className="h-5 w-5 text-green-500" />, title: 'Grow your audience' },
                  { icon: <Coffee className="h-5 w-5 text-yellow-500" />, title: 'Monetize your content' },{ icon: <Bookmark className="h-5 w-5 text-indigo-500" />, title: 'Powerful analytics' }
                ].map((feature) => (
                  <div key={feature.title} className="flex">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto facere placeat quisquam.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 lg:mt-0 w-4/5">
              <img
                className="rounded-lg shadow-xl"
                src={Platform}
                alt="Platform screenshot"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Writers */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Featured Writers</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Meet the voices shaping conversations on our platform
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredWriters && featuredWriters.map((writer) => (
              <div key={writer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <img
                    className="h-32 w-32 rounded-full mx-auto"
                    src={writer.image}
                    alt="Writer"
                  />
                  <h3 className="mt-6 text-xl font-medium text-gray-900">{writer.first_name} {writer.last_name}</h3>
                  {/* <p className="text-sm text-indigo-600 font-medium">Tech & Culture</p> */}
                  <p className="mt-2 text-base text-gray-500">
                    {writer.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                  </p>
                  {/* <div className="mt-5">
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      View Profile
                    </a>
                  </div> */}
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm flex justify-between">
                    <div className="flex space-x-4">
                      <span className="font-medium text-gray-500">{writer.stat.posts} posts</span>
                      <span className="font-medium text-gray-500">{writer.stat.reactions} interactions</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-500 font-medium">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="mt-10 text-center">
            <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Discover More Writers
            </a>
          </div> */}
        </div>
      </div>

      {/* Resources for Writers */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Resources for Writers</h2><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Everything you need to improve your craft and grow your audience
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Writing Workshops', desc: 'Weekly live sessions with professional writers and editors' },
              { title: 'SEO Guide', desc: 'Learn how to optimize your content for better visibility' },
              { title: 'Platform Tutorials', desc: 'Step-by-step guides to make the most of our features' },
              { title: 'Community Forum', desc: 'Connect with other writers and share experiences' },
              { title: 'Analytics Dashboard', desc: 'Track your growth and understand your audience' },
              { title: 'Monetization Guide', desc: 'Strategies to earn income from your writing' }
            ].map((resource, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                <p className="mt-2 text-gray-500">{resource.desc}</p>
                <div className="mt-4">
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Trending Topics</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Artificial Intelligence', 'Climate Change', 'Remote Work', 'Mental Health', 'Productivity', 'Data Science', 'Personal Growth', 'Future of Work', 'Technology', 'Creativity'].map((topic) => (
              <a 
                key={topic} 
                href="#" 
                className="bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 border border-gray-200"
              >
                #{topic.replace(' ', '')}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Stay up to date
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-indigo-100">
              Subscribe to our newsletter to get weekly curated content and writing tips delivered to your inbox.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-indigo-100">
              We care about your data. Read our{' '}
              <a href="#" className="text-white font-medium underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">WriteSpace</span>
              </div>
              <p className="text-gray-500 text-base">
                Where great ideas find their voice. A platform for writers to connect, create, and inspire.
              </p>
              <div className="flex space-x-6">
                {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 flex items-center justify-center bg-gray-100 rounded-full">
                      {social[0]}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Platform</h3>
                  <ul className="mt-4 space-y-4">
                    {['About', 'Features', 'Pricing', 'FAQ', 'Support'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                  <ul className="mt-4 space-y-4">
                    {['Guides', 'Tutorials', 'Examples', 'Documentation'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    {['Team', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                          {item}
                        </a>
                      </li>
                    ))}
                    </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    {['Privacy', 'Terms', 'Cookies', 'Settings'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>

  );
};

export default Home;