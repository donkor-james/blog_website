import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";
// import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainRoutes />
      </Router>
    </AuthProvider>
  );
}

function MainRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/posts" element={<Blogs />} />
      {/* <Route path="/post-detail/:id" element={<BlogDetail />} /> */}
      {/* <Route path="/contact" element={<Contact />} /> */}
      {/* <Route
      path="/service-details/:id/:title"
      element={<ServiceDetails />}
    /> */}

      {/* Login Route */}
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/logout" element={<Logout />} />

      {console.log("admin route", isAuthenticated)}

      <Route
        path="/admin-page"
        element={
          token != null || token != "" ? (
            <AdminLayout />
          ) : (
            <Login setToken={setToken} />
          )
        }
      >
        <Route path="*" element={token ? <AdminLayout /> : <Login />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="posts/create-post" element={<Post />} />
        <Route path="posts/post/:id" element={<Post />} />
      </Route>
    </Routes>
  );
}
export default App;
