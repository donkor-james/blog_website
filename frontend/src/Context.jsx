import { useState, createContext, useContext, useEffect } from "react";

const Context = createContext()

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)
    const [recentPosts, setRecentPosts] = useState({})
    const [userPosts, setUserPosts] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState((localStorage.getItem('refresh') === null) ? false : true)
    const [categories, setCategories] = useState(null)
    const [featuredWriters, setFeaturedWriters] = useState(null)
    const [FeaturedPosts, setFeaturedPosts] = useState(null)
    const [access, setAccess] = useState(null)
    const [refresh, setRefresh] = useState()

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
                await fetchUser();
                await fetchUserPosts();
            }
            
            // These don't need authentication
            await fetchPosts();
            await fetchCategories();
            await fetchRecentPosts()
            await fetchFeaturedWriters()
            await fetchFeaturedPosts()
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
                fetchUserPosts()
            }else if(response.status === 401){
                // If the access token is invalid, try to refresh it
                // console.log('Access token expired, trying to refresh...')
                const new_access = await refreshAccessToken();
                if (new_access){
                const new_response = await fetch('http://localhost:8000/api/users/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${new_access}`,
                    'Content-Type': 'application/json'
                }
            })

            if (new_response.ok){
                const new_data = await new_response.json()
                setUser(new_data)
                console.log(new_data)
                setIsAuthenticated(true)
                fetchUserPosts()
            }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
            }
                }
            }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
            
                console.log(response)
                // console.log(localStorage.getItem('refresh'), 'loca refresh')
                throw new Error(`${response.status} ${response.statusText
                }`)

            }
        }catch(error){
            console.log(localStorage.getItem('access'), 'loca refresh err')
            console.log(error)
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

    const fetchPosts = async () => {
        console.log(access, "access in fetch user")
        try{
            console.log(access, "Inside fetch user")
            const response = await fetch('http://localhost:8000/api/blog/posts/')

            if (response.ok){
                const data = await response.json()
                setPosts(data)
                console.log(data)
                // setIsAuthenticated(true)
            }else{
                throw new Error(`${response.status} ${response.statusText
                }`)

            }
        }catch(error){
            console.error(error)
        }
    }
    
    const fetchRecentPosts = async () => {
        console.log(access, "access in fetch user")
        try{
            console.log(access, "Inside fetch user")
            const response = await fetch('http://localhost:8000/api/blog/recent-posts/')

            if (response.ok){
                const data = await response.json()
                setRecentPosts(data)
                console.log(data)
                // setIsAuthenticated(true)
            }else{
                throw new Error(`${response.status} ${response.statusText
                }`)

            }
        }catch(error){
            console.error(error)
        }
    }

    const fetchCategories = async () => {
        
        try{
            const response = await fetch("http://localhost:8000/api/blog/categories/")

            if (response.ok){
                const data = await response.json()
                setCategories(data)
                console.log(data)
            }else{
                throw new Error('Something went wrong')
            }
        }catch(error){
            console.log(error)
        }

    }

    const fetchFeaturedWriters = async () => {
        
        try{
            const response = await fetch("http://localhost:8000/api/users/featured-writers/")

            if (response.ok){
                const data = await response.json()
                setFeaturedWriters(data)
                console.log(data, "writers")
            }else{
                throw new Error('Something went wrong')
            }
        }catch(error){
            console.log(error)
        }

    }

    const fetchFeaturedPosts = async () => {
        
        try{
            const response = await fetch("http://localhost:8000/api/blog/featured-posts/")

            if (response.ok){
                const data = await response.json()
                setFeaturedPosts(data)
                console.log(data, "posts featured")
            }else{
                throw new Error('Something went wrong')
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
        await fetchUser()
    }

    const userLogout = async () => {
        localStorage.removeItem('refresh')
        localStorage.removeItem('access')
        setIsAuthenticated(false)
    }

    const deleteUserPost = async (post_id) => {
        setUserPosts(userPosts.filter(post => post.id !== post_id));
        fetchPosts()
    }

    const addUserPost = async () => {
        fetchUserPosts()
        fetchPosts()
    }

    return(
        <Context.Provider value={{ setUser, setIsAuthenticated, userLogin, userLogout, deleteUserPost, addUserPost ,setUserPosts, setPosts, refreshAccessToken, FeaturedPosts, featuredWriters, recentPosts, isAuthenticated, user, categories, access, posts, userPosts}}>
            {children}
        </Context.Provider>
    )
}

export const MyContext = () =>{
    const context = useContext(Context);
    // console.log('MyContext called, context value:', context);
    return context;
}
