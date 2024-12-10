import { useContext, useState } from "react";
import Cookies from "js-cookie";
import './Dashboard.css';
import { useSelector } from "react-redux";
import { AdminContext } from "../../../context/adminContext";
import { useNavigate } from "react-router-dom";
import user_default_icon from '../../../assets/user_default_icon.png'
const DashboardContainer = () => {
    let admin = useSelector((state: any) => state.admin);
    console.log(admin,'ggg')
    const adminContext = useContext(AdminContext);
    const refresh = Cookies.get('adminRefreshToken');
    console.log(refresh,'aa');
    const navigate = useNavigate();

    const usergo = () => {
        navigate('/admin/users');
    } 

    return (
        <div className="admin-container">
            <div className="admin-info">
                { admin ? (
                    <>
                        <img src={user_default_icon} alt={admin?.name} className="admin-img"/>
                        <p className="admin-name">{admin?.name}</p>
                        <p className="admin-email">{admin?.email}</p>
                        <button onClick={usergo}>User List</button>
                    </>
                ) : (
                    <>
                        <img src="" alt="No admin data available" className="admin-placeholder-image" />
                    </>
                ) }
            </div>
        </div>
    )
}

export default DashboardContainer;