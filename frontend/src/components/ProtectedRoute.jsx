import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { MyContext } from "../Context";


const ProtectRoutes = () =>{

   const context = MyContext()

    if (context === undefined) {
        return <div></div>; // or some loading spinner
    }
    
    const { isAuthenticated } = context;
    return isAuthenticated ? <Outlet/> : <Navigate to='/login'/>
}

export default ProtectRoutes 