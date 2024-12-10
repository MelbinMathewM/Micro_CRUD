import { useContext, useState } from "react";
import Navbar from "../../../Components/Admin/Navbar/Navbar";
import UserList from "../../../Components/Admin/List/List";
import { useNavigate } from "react-router-dom";
import './User.css'
import { AdminContext } from "../../../context/adminContext";


const Users = () => {

    const adminContext = useContext(AdminContext);

    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/admin/dashboard')
    }

    return (
        <>
            <Navbar handleBack={handleBack}/>
            <UserList />
        </>
    )
}

export default Users;