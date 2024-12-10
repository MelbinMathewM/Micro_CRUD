import { useContext, useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import './Navbar.css';
import { AdminContext } from "../../../context/adminContext";

interface NavbarProps {
    handleBack? : () => void;
}

const Navbar : React.FC<NavbarProps> = ({ handleBack }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const adminContext = useContext(AdminContext);

    const logout = () => {
        adminContext?.logout();
        navigate('/admin/login');
    }

    const handleAdd = () => {
        navigate('/admin/add')
    }

    return (
        <div className="navbar">
            <div className="navbar-left">
                <h3>Userecom</h3>
            </div>
            <div className="navbar-right">
                { location.pathname === '/admin/dashboard' ? (
                    <button onClick={logout}>Logout</button>
                ) : location.pathname === '/admin/users' ? (
                    <>
                        <button onClick={handleAdd}>Add User</button>
                    </>
                ) : null}
                {handleBack ? <button onClick={handleBack}>Go Back</button> : null}
            </div>
        </div>
    )
}

export default Navbar;