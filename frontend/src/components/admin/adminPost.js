// AdminPosts.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [deleteBtn, setDeleteBtn] = useState("bg-red-300 cursor-not-allowed");
  const [deleteList, setDeleteList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // Adjust this value as needed

  // Calculate total number of pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Calculate which posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const navigate = useNavigate();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/get-posts", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("An error occurred:", error.message);
        localStorage.setItem("accessToken", "");
        // navigate("/login");
      } else {
        console.error("Resource not found:", error.message);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/posts/delete-post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteList }), // Use email instead of username
      });

      if (response.ok) {
        const data = await response.json();
        fetchPosts();
        setDeleteList([]);
        setDeleteBtn("bg-red-300 cursor-not-allowed");
        handleChechbox();
      } else if (!response.ok) {
        // If response is not ok, throw an error with status
        const errorData = await response.json();
        throw new Error(`
          ${response.status}: ${errorData.message || "Error occurred"}
        `);
      }
    } catch (error) {
      console.error("1 An error occurred:", error.message);
      if (error.message.includes("401") || error.message.includes("422")) {
        localStorage.setItem("accessToken", "");
        navigate("/login");
      } else {
        console.error("An error occurred, Try again later", error);
      }
    }
  };

  const handleChechbox = (e) => {
    let value = e.target.value;
    if (deleteList.includes(value)) {
      let index = deleteList.indexOf(value);
      deleteList.splice(index, 1);
    } else {
      deleteList.push(e.target.value);
    }
    if (deleteList.length > 0) {
      setDeleteBtn("bg-red-600 cursor-pointer");
    } else {
      setDeleteBtn("bg-red-300 cursor-not-allowed");
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 md:px-20  sm:mt-4 mt-20 mx-2 rounded-lg shadow-md">
      <div className="text-right space-x-2">
        <Link to="/admin-page/posts/create-post">
          <button className="text-md font-normal mb-4 text-gray-100 bg-gray-500 px-4 py-1 rounded-full">
            <div className="flex items-center">
              Add Post <span className="text-lg ml-2"></span>
            </div>
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className={`text-md font-normal mb-4 text-gray-100 ${deleteBtn} px-6 py-1 rounded-full`}
        >
          <div className="flex items-center ">
            Delete <span className="text-lg ml-2"></span>
          </div>
        </button>
      </div>
      {currentPosts.length > 0 ? (
        <ul className="space-y-2">
          <li className="border-b pb-2 font-semibold text-lg">Posts</li>
          {currentPosts.map((post) => (
            <div key={post.id}>
              <li className="flex justify-between border-b pb-2">
                <div>
                  Title:
                  <Link to={`/admin-page/posts/post/${post.id}`}>
                    <span className="text-blue-500 ml-2">{post.title}</span>
                  </Link>
                </div>
                <input
                  type="checkbox"
                  value={post.id}
                  className="mr-2"
                  onClick={(e) => {
                    handleChechbox(e);
                  }}
                />
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          <li className=" pb-2 font-semibold text-lg">Posts</li>
          <div className="text-center text-lg pb-8"></div>
        </ul>
      )}

      {currentPosts.length > 0 ? (
        <div className="flex justify-between mt-12">
          {currentPage > 1 ? (
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
          ) : null}

          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AdminPosts;
