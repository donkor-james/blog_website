import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex sm:flex-row flex-wrap justify-between md:mx-32 sm:mx-16 mx-4">
          <div className="mb-4 mr-6">
            <div className="text-lg font-semibold">Contact Us</div>
            <p>Stan Consultancy</p>
            <p>KNUST - Kumasi</p>
            <p>Ghana</p>
            <p>+233 247839941</p>
          </div>
          <div className="mb-4 mr-6">
            <div className="text-lg font-semibold">Quick Links</div>
            <ul>
              <div className="hover:underline">
                <Link to="/">Home</Link>
              </div>

              <div className="hover:underline">
                <Link to="/blog">Blog</Link>
              </div>
              <div className="hover:underline">
                <Link to="/services">Service</Link>
              </div>
              <div className="hover:underline">
                <Link to="/contact">Contact Us</Link>
              </div>
              <li>
                <a
                  href="https://forms.gle/uEbPEfFsGfvWZHuJ8"
                  target="_blank"
                  className="hover:underline"
                >
                  Book Us
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-5 md:-mt-1 mr-6">
            <div className="text-lg font-semibold">Follow Us</div>
            <ul className="flex flex-col mt-1">
              <li>
                <a
                  href="#"
                  className="hover:underline space-x-2"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook fa-lg"></i>{" "}
                  <span>Facebook</span>
                  {/* Replace with actual icon */}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline space-x-2"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter fa-lg"></i>
                  <span>Twitter</span>
                  {/* Replace with actual icon */}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline space-x-2"
                  aria-label="Instagram"
                >
                  <i className="fab fa-youtube fa-lg"></i> <span>Youtube</span>
                  {/* Replace with actual icon */}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline space-x-2"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in fa-lg"></i>{" "}
                  <span>linkedin</span>
                  {/* Replace with actual icon */}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center text-center mt-4">
        <p className="mt-2">© 2024 Stan Consultancy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
