import { Bell, Link, X } from 'lucide-react';
import { useState } from 'react';
import { MyContext } from '../Context';
import { useNavigate } from 'react-router-dom';

const Notification = ({ notifications, showDropdown, setShowDropdown, unreadCount }) => {
    const {isConnected, refreshAccessToken } = MyContext();
    const [error, setError] = useState(false);
    let postLink = '/blogs/postDetail/';

    const navigate = useNavigate();

    const handleNavigate = (postId) => {
        setShowDropdown(false);
        navigate(`${postLink}${postId}`);
    }

    // const unreadCount = notifications.unreadCount || 0;
    console.log('Notifications in component:', notifications, unreadCount);
    // const markAsRead = (index) => {
    //     const updatedNotifications = [...notifications];
    //     updatedNotifications[index].is_read = true;
    //     setNotifications(updatedNotifications);
    // };

    const clearNotification = (index) => {
        // setNotifications(notifications.filter((_, i) => i !== index));
    };


    

    return(
        <div className="relative">
            <button 
                className="relative focus:outline-none"
            >
                <Bell size={24} className="text-gray-600 hover:text-gray-800" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                {isConnected && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full h-2 w-2"></span>
                )}
            </button>

            {showDropdown && (
                <div
                    className="z-50 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 mt-2"
                    style={{
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        top: '60px', // adjust as needed for your navbar height
                        margin: '0 auto',
                        width: '95%',
                        maxWidth: '22rem',
                    }}
                >
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <button 
                            onClick={() => setShowDropdown(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {error ? "Something went wrong while loading notifications" : "No notifications yet"}
                        </div>
                    ) : (
                        <div>
                            {notifications.map((notification, index) => (
                                <div 
                                        key={index}
                                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                                            !notification.is_read ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleNavigate(notification.post)}
                                    >
                                        <div>
                                            {notification.users.length > 1 && (
                                                <div className="flex -space-x-2 mb-2">
                                                    {notification.users.slice(0, 3).map((user, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={user.profile_picture}  
                                                            alt="User"
                                                            className="w-10 h-10 rounded-full border-2 border-white"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-start">
                                            { notification.users.length === 1 ? <img src={notification.users[0].profile_picture} alt="User" className='w-16 h-16 rounded-full mr-4'/>: null}
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 flex">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notification.created_at || 'Just now'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => clearNotification(index)}
                                                className="ml-2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Notification
