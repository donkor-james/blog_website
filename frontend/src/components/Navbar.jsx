import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { MyContext } from '../Context';
import { Link } from 'react-router-dom';

const Navbar = () =>{
    const { isAuthenticated, user, userLogout} = MyContext()
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    console.log(isAuthenticated)


    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        userLogout()
        navigate('/')
    
    }
    const handleDashboard = () => {
        navigate('/dashboard')
    }

    return(
        <div>
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <li className="h-8 w-8 text-indigo-600" />
                        <Link to='/'>
                            <span className=" text-xl font-bold text-gray-900">WriteSpace</span>
                        </Link>
                    </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link to='/' className="border-indigo-500 border-b-2 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                            Home
                        </Link>
                        <Link to='' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Blogs
                        </Link>
                        <Link to='' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            Categories
                        </Link>
                        <Link to='/about' className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                            About
                        </Link>
                    </div>
                    <div className="flex items-center">
                    {/* <div className="flex-shrink-0">
                        <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                            placeholder="Search posts..."
                        />
                        </div>
                    </div> */}
                    { isAuthenticated ? (
                        <div className="hidden md:ml-4 md:flex md:items-center">
                            <div className="relative mr-4">
                                <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer" />
                            </div>
                            <button className="mr-6 bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                                Write Post
                            </button>
                            <img src={user? user.image: null} alt="" className='w-10 h-10 rounded-full' />
                            <div className="relative">
                            <button
                            onClick={handleToggle}
                            className="flex items-center ml-1 py-2 text-gray-500"
                            aria-haspopup="true"
                            aria-expanded={isOpen}
                            >
                            <svg
                                className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                                {isOpen && (
                                    <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                    <ul>
                                        <li>
                                        <Link
                                            to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Dashboard
                                        </Link>
                                        </li>
                                        <li>
                                        <Link
                                            to="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Profile
                                        </Link>
                                        </li>
                                        <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Logout
                                        </button>
                                        </li>
                                    </ul>
                            </div>
                                )}
                            </div>                        
                        </div>) : 
                        <div className='flex gap-4'>
                            <div className='text-indigo-600 border border-indigo-600  px-6 py-2 rounded-md text-sm font-medium'>
                                <Link to='/login'>Login</Link>
                            </div>
                            <div className='bg-indigo-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700'>
                                <Link to='/Register'>Register</Link>
                            </div>
                        </div>
                    }
                    </div>
                </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;