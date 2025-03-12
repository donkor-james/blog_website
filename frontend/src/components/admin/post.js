import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const Post = () => {
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [files, setfiles] = useState(null);
  const [editorHtml, setEditorHtml] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (id) {
      fetch(`/api/posts/post/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json(); // Parse JSON data from the response
        })
        .then((data) => {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      let response;
      if (id) {
        // PUT request to update the post
        response = await fetch(`/api/posts/post-update/${id}`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      } else {
        // POST request to create a new post
        response = await fetch("/api/posts", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // If response is not ok, throw an error with status
        const errorData = await response.json();
        throw new Error(`
          ${response.status}: ${errorData.message || "Error occurred"}
          `);
      }

      const data = await response.json();

      // Optionally reset the form or handle success
      navigate("/admin-page/posts");
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

  const handleChange = (html) => {
    setContent(html);
  };

  return (
    <div className="bg-white px-4 pt-4 pb-2 mx-4 md:p-6 md:px-20 rounded-lg shadow-md sm:mt-10 mt-16 md:mt-20 ">
      {/* <h1 className="text-2xl font-bold mb-4 ">Manage Posts</h1> */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mb-6"
      >
        <div>
          <label className=" font-semibold text-md text-gray-600">
            Title *
          </label>
          <input
            type="text"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 rounded p-2 w-full mb-2 mt-1"
          />
        </div>

        <div className="mb-6">
          <label className="font-semibold text-md text-gray-600">
            Content *
          </label>
          <div>
            <ReactQuill
              value={content}
              onChange={handleChange}
              // className="max-h-28"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline"],
                  ["link", "image"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"], // remove formatting button
                ],
              }}
            />
          </div>
        </div>
        <div className=" mb-4">
          <label className="font-semibold text-md text-gray-600 mr-4">
            Image for Event:
          </label>
          {id && (
            <div className="mb-2">
              Current image:
              <span className="file-link ml-2">
                <a href={post.image} target="_blank" download={post.title}>
                  {post.filename}
                </a>
              </span>
              {/* {Object.keys(post.docs).map((key, index) => (
                <div key={index}>
                  {key}: {post.docs[key]}
                </div>
              ))} */}
            </div>
          )}
          <input
            type="file"
            accept=".jpg, .png, .jpeg"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className=" mb-4">
          <label className="font-semibold text-md text-gray-600 mr-12">
            Documents:
          </label>
          {id && post.docs && (
            <div className=" flex flex-wrap">
              <span className=" whitespace-nowrap mr-2">Current docs:</span>
              <span className=" flex flex-wrap">
                {post.docs.map((doc, index) => (
                  <a
                    className="file-link mr-2"
                    href={doc.doc}
                    target="_blank"
                    download={doc.title}
                    key={index}
                  >
                    {JSON.stringify(doc.title)}
                  </a>
                ))}
              </span>
              {/* <span className="file-link"></span> */}
            </div>
          )}
          <input
            type="file"
            accept=".pdf, .docx, .txt, .ppx, .pptx, .ppt .doc"
            multiple
            name="[]"
            onChange={(e) => setfiles(e.target.files)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-12 py-2 rounded"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
