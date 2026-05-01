import { useState, createContext, useContext, useEffect, useCallback } from "react";
import useWebSocket from "./hooks/useWebSocket";

const Context = createContext()

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([]) // Ensure posts is always an array
    const [recentPosts, setRecentPosts] = useState({})
    const [userPosts, setUserPosts] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState((localStorage.getItem('refresh') === null) ? false : true)
    const [categories, setCategories] = useState({})
    const [featuredWriters, setFeaturedWriters] = useState({})
    const [FeaturedPosts, setFeaturedPosts] = useState({})
    const [access, setAccess] = useState(null)
    const [refresh, setRefresh] = useState()
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [loading, setLoading] = useState(false)

    // Handler for WebSocket token expiration
    const handleTokenExpired = useCallback(async () => {
        console.log('WebSocket token expired, refreshing...');
        const newAccessToken = await refreshAccessToken();
        return newAccessToken;
    }, [refresh]);

    // WebSocket for notifications (only for authenticated users)
    let { notifications, isConnected, setNotifications, unreadCount, setUnreadCount } = useWebSocket(
        'ws://localhost:8000/ws/general/',
        isAuthenticated ? access : null,
        handleTokenExpired
    )
    // Ensure notifications is always an array
    if (!Array.isArray(notifications)) notifications = [];

    // // Fetch existing notifications from REST API
    // cons = async () => {
    //     if (!isAuthenticated) return;
        
    //     try {
    //         const response = await fetch('http://localhost:8000/api/notification/notifications/', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('access')}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setNotifications(data.notifications);
    //             setUnreadCount(data.unreadCount)
    //             console.log('Fetched notifications:', data);
    //         } else if (response.status === 401) {
    //             const new_access = await refreshAccessToken();
    //             if (new_access) {
    //                 const retry = await fetch('http://localhost:8000/api/notification/notifications/', {
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': `Bearer ${new_access}`,
    //                         'Content-Type': 'application/json'
    //                     }
    //                 });
    //                 if (retry.ok) {
    //                     const data = await retry.json();
    //                     setNotifications(data.notifications);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error fetching notifications:', error);
    //     }
    // };

    useEffect(() => {
        const initializeApp = async () => {
            // Get tokens first
            const accessToken = localStorage.getItem('access');
            const refreshToken = localStorage.getItem('refresh');
            
            console.log('Access Token:', accessToken);
            console.log('Refresh Token:', refreshToken, 'refresh token in useEffect', localStorage.getItem('refresh'), 'local storage refresh token');
            setAccess(accessToken);
            setRefresh(refreshToken);
            
            // Only proceed if we have tokens
            if (accessToken) {
                setLoading(true)
                try{
                    await fetchUser();
                    await fetchUserPosts();
                }catch(err){
                    console.error('Error during initialization:', err);
                }finally{
                    setLoading(false)
                }
            }
            
            // await fetchPosts();
            // These don't need authentication

        };
        
        initializeApp();
    }, []); // Empty dependency array - only run once on mount

    // useEffect(() =>{
    // })

    const getTokens = ()=>{
        setAccess(localStorage.getItem('access'))
        setRefresh(localStorage.getItem('refresh'))
    }

    const refreshAccessToken = async () => {
        console.log('Refreshing access token...', refresh)
        if (!refresh) {
            console.log('No refresh token found, user is not authenticated.')
            setIsAuthenticated(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/users/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: refresh })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh || refresh);
                setAccess(data.access);
                setRefresh(data.refresh || refresh);
                console.log('Access token refreshed successfully');
                // await fetchUser(); // Fetch user data after refreshing token
                return data.access
            } else {
                console.error('Failed to refresh access token:', response.status, response.statusText);
                localStorage.removeItem('refresh');
                localStorage.removeItem('access');
                setIsAuthenticated(false);
                return false
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
        }
    }

    const fetchUser = async () => {
        console.log(access, "access in fetch user")
        try{
            console.log(access, "Inside fetch user")
            const response = await fetch('http://localhost:8000/api/users/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok){
                const data = await response.json()
                setUser(data)
                console.log(data)
                setIsAuthenticated(true)
                return;
                // fetchUserPosts()
            }
            else if(response.status === 401){
                console.log('Access token expired, attempting to refresh...')
                const new_access = await refreshAccessToken()
                if (new_access){ 
                    const new_response = await fetch('http://localhost:8000/api/users/profile/', {
                        method: 'GET',
                        headers:{
                            'Authorization': `Bearer ${new_access}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (new_response.ok){
                        const new_data = await new_response.json()
                        setUser(new_data)
                        console.log(new_data)
                        setIsAuthenticated(true)
                        // fetchUserPosts()
                        return;
                    }
                
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
                }
            }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
            }
            // if (new_response.ok){
            //     const new_data = await new_response.json()
            //     setUser(new_data)
            //     console.log(new_data)
            //     setIsAuthenticated(true)
            //     fetchUserPosts()
            // }else{
            //     localStorage.removeItem('refresh')
            //     localStorage.removeItem('access')
            //     setIsAuthenticated(false)
            // }            
        }catch(error){
            console.log(localStorage.getItem('access'), 'loca refresh err')
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const fetchUserPosts = async () =>{
        try{
          const response = await fetch(`http://localhost:8000/api/blog/user-posts/`, {
            method: "GET",
            headers:{
              "Authorization": `Bearer ${localStorage.getItem('access')}`,
              "Content-Type": "application/json"
            }
          })
      
          if (response.ok){
            const new_data = await response.json()
            console.log(new_data)
            setUserPosts(new_data)
          }else if(response.status === 401){
            const new_access = await refreshAccessToken()
            if (new_access){ 
                const new_response = await fetch(`http://localhost:8000/api/blog/user-posts/`, {
                method: "GET",
                headers:{
                  "Authorization": `Bearer ${new_access}`,
                  "Content-Type": "application/json"
                }
              })
              if (new_response.ok){
                const new_data = await new_response.json()
                console.log(new_data)
                setUserPosts(new_data)
              }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
              }
            }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
            }
          }
        }catch(error){
            console.log(error)
        }
      } 


    const userLogin = async (refreshToken, accessToken) => {
        console.log('User login called with tokens:', refreshToken, accessToken);
        localStorage.setItem('refresh', refreshToken)
        localStorage.setItem('access', accessToken)
        setAccess(accessToken)
        setRefresh(refreshToken)
        setIsAuthenticated(true)
        setLoading(true)
        await fetchUser()
        // awai()
    }

    const userLogout = async () => {
        localStorage.removeItem('refresh')
        localStorage.removeItem('access')
        setIsAuthenticated(false)
        setNotifications([])
    }

    const deleteUserPost = async (post_id) => {
        setUserPosts(userPosts.filter(post => post.id !== post_id));
    }

    const addUserPost = async () => {
        fetchUserPosts()
    }

    if (loading){
        return <div> Loading ...</div>
    }

    return(
        <Context.Provider value={{ setUser, setIsAuthenticated, userLogin, userLogout, 
        refreshAccessToken, isAuthenticated, user, categories, access, loading, 
        notifications, isConnected, setNotifications, unreadCount, setUnreadCount}}>
            {children}
        </Context.Provider>
    )
}


export const MyContext = () => {
    const context = useContext(Context);
    // Prevent destructuring from undefined
    return context;
}
