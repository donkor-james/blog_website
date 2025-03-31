import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { MyContext } from "../Context";


const ProtectRoutes = () =>{

    const {isAuthenticated} = MyContext()

    return isAuthenticated ? <Outlet/> : <Navigate to='/login'/>
}

export default ProtectRoutes 