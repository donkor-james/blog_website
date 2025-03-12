// import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
// // import HomePage from "./components/home";
// // import About from "./components/about";
// // import HomePage from "./components/home";
// // import Services from "./components/services";
// // import Contact from "./components/contact";
// // import ServiceDetails from "./components/serviceDetails";
// import AdminLayout from "./components/admin/admin";
// import AdminPosts from "./components/admin/adminPost";
// import AdminBooks from "./components/admin/adminBook";
// // import Post from "./components/admin/post";
// // import Login from "./components/login";
// import { useState, useEffect } from "react";
// import axios from "axios";
// // import Blogs from "./components/blogs";
// // import BlogDetail from "./components/blogDetail";
// // import Logout from "./components/logout";

// function AppRoutes() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/services" element={<Services />} />
//         <Route path="/posts" element={<Blogs />} />
//         <Route path="/post-detail/:id" element={<BlogDetail />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route
//           path="/service-details/:id/:title"
//           element={<ServiceDetails />}
//         />

//         {/* Login Route */}
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/logout" element={<Logout />} />

//         {console.log("admin route", isAuthenticated)}

//         <Route
//           path="/admin-page"
//           element={
//             token != null || token != "" ? (
//               <AdminLayout />
//             ) : (
//               <Login setToken={setToken} />
//             )
//           }
//         >
//           <Route path="*" element={token ? <AdminLayout /> : <Login />} />
//           <Route path="posts" element={<AdminPosts />} />
//           <Route path="books" element={<AdminBooks />} />
//           <Route path="posts/create-post" element={<Post />} />
//           <Route path="posts/post/:id" element={<Post />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;
