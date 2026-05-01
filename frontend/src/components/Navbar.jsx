import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { MyContext } from '../Context';
import { Link } from 'react-router-dom';

import Notification from './Notification';
import './Navbar.css';


const Navbar = () =>{
    const { isAuthenticated, user, userLogout, refreshAccessToken} = MyContext()
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate()


    useEffect(() => {

        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/general/`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received in Navbar:', data);
            setUnreadCount(data.notification.unreadCount);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, [user]);



    // Toggle user dropdown (desktop)
    const handleUserDropdownToggle = () => {
        setUserDropdownOpen((prev) => !prev);
    };

    // Toggle mobile menu (hamburger)
    const handleMobileMenuToggle = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    // Make sure this is defined before the return statement
    const handleShowDropdown = async () => {
        const response = await fetch('http://localhost:8000/api/notification/notifications/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            }});

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched notifications:', data);
            setNotifications(data);
        }

        
        if (!showDropdown) {
            await handleReadNotifications();
        }
        setShowDropdown(!showDropdown);
    };

    const handleReadNotifications = async () => {
       const response = await fetch('http://localhost:8000/api/notification/notifications/mark-read/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            }
        }) 
         if (response.status === 401) {
            await refreshAccessToken();
            // Retry marking notifications as read after refreshing token
            await fetch('http://localhost:8000/api/notifications/mark-read/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            })

         }
    }

    const handleLogout = () => {
        userLogout()
        navigate('/')
    
    }
    const handleDashboard = () => {
        navigate('/dashboard')
    }

        return (
            <div>
                <nav className="bg-white shadow-sm relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    {/* <li className="h-8 w-8 text-indigo-600" /> */}
                                    <Link to='/'>
                                        <span className="text-xl font-bold text-gray-900">WriteSpace</span>
                                    </Link>
                                </div>
                            </div>
                            {/* Desktop Menu */}
                            <div className="navbar-desktop-menu hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link to='/' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Home
                                </Link>
                                <Link to='/blogs' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Blogs
                                </Link>
                                {/* <Link to='' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Categories
                                </Link> */}
                                <Link to='/about' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    About
                                </Link>
                            </div>
                            {/* Right Side (Notification, Write Post, User DP) */}
                            <div className="flex items-center gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <div onClick={handleShowDropdown}>
                                            <Notification
                                                notifications={notifications.notifications || []}
                                                showDropdown={showDropdown}
                                                setShowDropdown={setShowDropdown}
                                                unreadCount={unreadCount}
                                            />
                                        </div>
                                        <Link to={`/dashboard/posts/create`}>
                                            <button className="mr-2 ml-2 bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                                                Write Post
                                            </button>
                                        </Link>
                                        {/* User display picture always visible */}
                                        <div className="relative flex items-center md:flex hidden">
                                            <img
                                                src={user ? user.image : null}
                                                alt=""
                                                className="w-10 h-10 rounded-full"
                                            />
                                            {/* Dropdown chevron icon, only on desktop */}
                                            <button
                                                type="button"
                                                className="ml-1 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 hidden sm:inline-flex"
                                                onClick={handleUserDropdownToggle}
                                                aria-haspopup="true"
                                                aria-expanded={userDropdownOpen}
                                            >
                                                <ChevronDown className={`w-5 h-5 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {/* Desktop user dropdown */}
                                            {userDropdownOpen && (
                                                <div className="absolute z-50 right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden sm:block">
                                                    <ul>
                                                        <li>
                                                            <Link
                                                                to="/dashboard"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                                onClick={() => setUserDropdownOpen(false)}
                                                            >
                                                                Dashboard
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="/dashboard/profile"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                                onClick={() => setUserDropdownOpen(false)}
                                                            >
                                                                Profile
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => { handleLogout(); setUserDropdownOpen(false); }}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                            >
                                                                Logout
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className='flex gap-2'>
                                        <div className='text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium'>
                                            <Link to='/login'>Login</Link>
                                        </div>
                                        <div className='bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700'>
                                            <Link to='/Register'>Register</Link>
                                        </div>
                                    </div>
                                )}
                            {/* Hamburger Icon for Mobile */}
                              <div className="navbar-mobile-hamburger sm:hidden flex items-center ml-4" onClick={handleMobileMenuToggle}>
                                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            </div>
                          
                        </div>
                    </div>
                    {/* Mobile Menu Dropdown */}
                    <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''} sm:hidden`}>
                        <Link to='/' className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to='/blogs' className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                            Blogs
                        </Link>
                        {/* <Link to='' className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                            Categories
                        </Link> */}
                        <Link to='/about' className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                            About
                        </Link>
                        {isAuthenticated && (
                            <>
                                <div className="border-t border-gray-200 my-2"></div>
                                <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                                    Dashboard
                                </Link>
                                <Link to="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                                    Profile
                                </Link>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        );
}

export default Navbar;