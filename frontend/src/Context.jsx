import { useState, createContext, useContext, Children, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Context = createContext()

export const ContextProvider = ({Children}) => {
    const [User, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const navigate = useNavigate()

    useEffect(() =>{
        fetchUser()
    })

    const fetchUser = async () => {
        try{
            const response = await fetch('api/user/profile')

            if (response.ok){
                const data = await response.json()
                setUser(data)
            }else{
                setIsAuthenticated(false)
                // setUser(null)      n b 0
                // navigate('/login')
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <Context.Provider value={{User, setUser, isAuthenticated, setIsAuthenticated, fetchUser}}>
            {Children}
        </Context.Provider>
    )
}