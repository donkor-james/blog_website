import { useState, createContext, useContext, useEffect } from "react";

const Context = createContext()

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState((localStorage.getItem('refresh') === null) ? false : true)
    const [access, setAccess] = useState(localStorage.getItem('access'))
    const [refresh, setRefresh] = useState(localStorage.getItem('refresh'))


    useEffect(() =>{
        getTokens()
        fetchUser()
    }, [access])

    const getTokens =async ()=>{
        setAccess(localStorage.getItem('access'))
        setRefresh(localStorage.getItem('refresh'))
    }

    const fetchUser = async () => {
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

    const userLogin = async (refreshToken, accessToken) => {
        localStorage.setItem('refresh', refreshToken)
        localStorage.setItem('access', accessToken)
        setAccess(accessToken)
        setRefresh(refreshToken)

        console.log('Afterlogin: ', access)
        setIsAuthenticated(true)
        fetchUser()
    }

    const userLogout = async () => {
        localStorage.removeItem('refresh')
        localStorage.removeItem('access')
        setIsAuthenticated(false)
    }

    return(
        <Context.Provider value={{ setUser, setIsAuthenticated, userLogin, userLogout, isAuthenticated, user}}>
            {children}
        </Context.Provider>
    )
}

export const MyContext = () =>{
    return useContext(Context)
}
