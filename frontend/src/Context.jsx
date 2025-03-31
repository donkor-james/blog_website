import { useState, createContext, useContext, useEffect } from "react";

const Context = createContext()

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)
    const [userPosts, setUserPosts] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState((localStorage.getItem('refresh') === null) ? false : true)
    const [categories, setCategories] = useState(null)
    const [access, setAccess] = useState(localStorage.getItem('access'))
    const [refresh, setRefresh] = useState(localStorage.getItem('refresh'))


    useEffect(() =>{
        getTokens()
        fetchUser()
        fetchPosts()
        fetchUserPosts()
        fetchCategories()
    }, [access])

    // useEffect(() =>{
    // })

    const getTokens =async ()=>{
        setAccess(localStorage.getItem('access'))
        setRefresh(localStorage.getItem('refresh'))
    }

    const fetchUser = async () => {
        console.log(access, "access in fetch user")
        try{
            console.log(access, "Inside fetch user")
            const response = await fetch('http://localhost:8000/api/users/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            })

            if (response.ok){
                const data = await response.json()
                setUser(data)
                console.log(data)
                setIsAuthenticated(true)
            }else{
                localStorage.removeItem('refresh')
                localStorage.removeItem('access')
                setIsAuthenticated(false)
                console.log(response)
                console.log(localStorage.getItem('refresh'), 'loca refresh')
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
              "Authorization": `Bearer ${access}`
            }
          })
      
          if (response.ok){
            const data = await response.json()
            // console.log(data)
            setUserPosts(data)
          }else if(response.status === 401){
            localStorage.removeItem('refresh')
            localStorage.removeItem('access')
            setIsAuthenticated(false)
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
            console.log(error)
        }
    }

    const fetchCategories = async () => {
        const response = await fetch("http://localhost:8000/api/blog/categories")

        if (response.ok){
            const data = await response.json()
            setCategories(data)
            console.log(data)
        }else{
            console.log(response.statusText)
        }

    }

    const userLogin = async (refreshToken, accessToken) => {
        localStorage.setItem('refresh', refreshToken)
        localStorage.setItem('access', accessToken)
        setAccess(accessToken)
        setRefresh(refreshToken)

        setIsAuthenticated(true)
        fetchUser()
    }

    const userLogout = async () => {
        localStorage.removeItem('refresh')
        localStorage.removeItem('access')
        setIsAuthenticated(false)
    }

    return(
        <Context.Provider value={{ setUser, setIsAuthenticated, userLogin, userLogout, isAuthenticated, user, categories, access, posts, userPosts}}>
            {children}
        </Context.Provider>
    )
}

export const MyContext = () =>{
    return useContext(Context)
}
