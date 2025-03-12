// AdminLayout.js
import { React, useState, useEffect } from "react";
import {
  Link,
  Outlet,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

const AdminLayout = ({ children }) => {
  const [postClick, setPostClick] = useState("");
  const [user, setUser] = useState(null);
  const { path } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${accessToken} ` },
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.setItem("accessToken", "");
      console.error("Error fetching data:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="sm:block hidden md:w-64 w-48 bg-white shadow-md">
        <Link to="/admin-page">
          <div className="p-4 text-lg font-semibold border-b">Admin Panel</div>
        </Link>
        <nav className="md:mt-4">
          <ul>
            <li>
              <Link
                to="/admin-page/posts"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Manage Posts
              </Link>
            </li>
            <li>
              <Link
                to="/admin-page/books"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Manage Books
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="sm:hidden absolute w-full bg-white shadow-md">
        <nav className=" flex justify-between items-center">
          <Link to="/admin-page">
            <div className="p-4 text-lg font-semibold">Admin Panel</div>
          </Link>
          <ul className="flex mx-2">
            <li>
              <Link
                to="/admin-page/posts"
                className="block px-4 py-2 text-gray-700 hover:text-gray-400 rounded"
              >
                POSTS
              </Link>
            </li>
            <li>
              <Link
                to="/admin-page/books"
                className="block px-4 py-2 text-gray-700 hover:text-gray-400"
              >
                BOOKS
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="block px-4 py-2 text-gray-700 hover:text-gray-400"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <main className="flex-1 md:p-6 pb-12 md:px-12 pt-2 border-red-600">
        {location.pathname == "/admin-page" && (
          <div className="mt-32 md:mt-8 mx-4 md:mx-2">
            <div className="bg-white py-6 md:px-12 px-2  rounded-lg shadow-md">
              <h1 className="text-2xl font-semibold mb-6">User Information</h1>
              <ul className="md:space-y-4 space-y-2">
                <li className="flex md:space-x-12 space-x-8">
                  <span>Username:</span>
                  <span className="text-gray-600">
                    {user ? user.username : ""}
                  </span>
                </li>
                <li className="flex space-x-16 md:space-x-20">
                  <span>Email:</span>
                  <span className="text-gray-600">
                    {user ? user.email : ""}
                  </span>
                </li>
                <li className="flex space-x-8 md:space-x-12">
                  <span>User Type:</span>
                  <span className="text-gray-600">{user ? "admin" : ""}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
