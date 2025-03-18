import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Login from "../pages/Login";


const ProtectRoutes = () =>{
    const [isAuthenticated ,setIsAuthenticated] = useState(()=>{
        return localStorage.getItem('isAuthenticated')
    })

    console.log('isAuthen: ', isAuthenticated)

    return isAuthenticated ? <Outlet/> : <Navigate to='/login'/>
}

export default ProtectRoutes 