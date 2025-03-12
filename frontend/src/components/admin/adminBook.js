// AdminBooks.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Post from "./post";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [deleteBtn, setDeleteBtn] = useState("bg-red-300");
  const [deleteList, setDeleteList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10; // Adjust this value as needed
  // Calculate total number of pages
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Calculate which posts to display
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentPosts = books.slice(indexOfFirstBook, indexOfLastBook);

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
    fetchBooks();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/get-posts");
      setPosts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Resource not found:", error.message);
      } else {
        console.error("An error occurred:", error.message);
        navigate("/login");
      }
    }
  };
  const fetchBooks = async () => {
    try {
      const response = await axios.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("An error occurred:", error.message);
        localStorage.setItem("accessToken", "");
      } else {
        console.error("Resource not found:", error.message);
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
      setDeleteBtn("bg-red-600");
    } else {
      setDeleteBtn("bg-red-400");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/books/delete-book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteList }), // Use email instead of username
      });

      if (response.ok) {
        const data = await response.json();
        fetchBooks();
        setDeleteList([]);
        setDeleteBtn("bg-red-300 cursor-not-allowed");
        handleChechbox();
      } else if (!response.ok) {
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
        console.error("An error occurred, Try again later");
      }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 md:px-20  sm:mt-4 mt-20 rounded-lg shadow-md">
      <div className="text-right">
        <button
          onClick={handleDelete}
          className={`text-md font-normal mb-4 text-gray-100 ${deleteBtn} px-6 py-1 rounded-full`}
        >
          <div className="flex items-center ">
            Delete <span className="text-lg ml-2"></span>
          </div>
        </button>
      </div>
      <ul className="space-y-2">
        <li className="border-b pb-2 font-semibold text-lg">Books</li>
        {posts.map((post) =>
          currentPosts.map((book) =>
            post.id === book.post_id ? (
              <li key={book.id} className="flex justify-between border-b pb-2">
                <div className="">
                  <div>
                    Title:
                    <span className=" ml-2">{book.title}</span>
                  </div>
                  <div key={post.id}>
                    <span className="text-gray-600 text-sm mb-4 mt-2 mr-2 ">
                      Related Post:
                    </span>
                    <span className="text-gray-600 text-sm mb-4 mt-2 ">
                      {post.title}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  value={book.id}
                  className="mr-2 border-8"
                  onClick={(e) => {
                    handleChechbox(e);
                  }}
                />
              </li>
            ) : null
          )
        )}
      </ul>

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

export default AdminBooks;
