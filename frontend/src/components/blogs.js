import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + " ... Read more";
    } else {
      return text;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/get-posts");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`); // Handle non-2xx responses
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  // Calculate the index of the first and last post on the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div>
      <Navbar />
      {/* <section className="text-white p-10 relative contact-hero">
        <div
          className="bg-center"
          style={{
            backgroundImage: "url(./header.png)",
          }}
        >
          <div className="flex items-center md:justify-center md:mt-32 mt-20">
            <h1 className="hero-header text-4xl md:text-5xl font-bold">
              Our Blog
            </h1>
          </div>
          <a
            className="md:hidden"
            href="https://forms.gle/uEbPEfFsGfvWZHuJ8"
            target="_blank"
          >
            <button className="mt-3 bg-yellow-400 text-black px-10 py-3 rounded">
              Book Us
            </button>
          </a>
        </div>
      </section> */}
      <div className="container md:mt-12 mt-10 mb-24 mx-auto md:px-24 px-10">
        <div className={`${posts.length > 0 ? "block" : "hidden"}`}>
          <h1 className="text-4xl md:text-5xl md:text-center font-bold md:mb-12 mb-4">
            Our <span className="span">Blog</span>
          </h1>
        </div>
        <div className="">
          {posts.length > 0 ? (
            currentPosts.map((post) => (
              <div
                key={post.id}
                className=" mb-8 md:px-16 px-2 py-4 border-0 border-b shadow-sm"
              >
                <div className=" flex flex-col md:ml-10 md:flex-row gap-y-5 md:gap-y-0 ">
                  <h2 className="text-2xl md:text-3xl capitalize sm:hidden block">
                    {post.title}
                  </h2>
                  <div className="post-image mr-8">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover "
                    />
                  </div>
                  <div className=" md:w-4/5">
                    <Link to={`/post-detail/${post.id}`}>
                      <h2 className="text-3xl capitalize sm:block hidden">
                        {post.title}
                      </h2>
                      <p className="mt-4 md:block hidden text-gray-800">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncateText(post.content, 350),
                          }}
                        />
                      </p>
                      <p className="mt-4 block md:hidden text-gray-800">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncateText(post.content, 240),
                          }}
                        />
                      </p>
                      <div className="text-sm mt-4 span">
                        Published: {post.created_at}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <div className="text-center my-12">
                <h1 className="text-4xl font-bold mb-4">
                  Our Blog is Coming Soon!
                </h1>
                <p className="text-lg mb-8">
                  Stay tuned for exciting articles and updates.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <nav>
            <ul className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
