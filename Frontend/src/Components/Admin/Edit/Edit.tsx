import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { adminAuth } from "../../../auth/adminAuth";
import { AdminContext } from "../../../context/adminContext";
import { useDispatch, useSelector } from "react-redux";
import { setAdminToken } from "../../../redux/store";
import Cookies from "js-cookie";
import './Edit.css'

interface Datas {
    _id: string,
    name: string,
    username : string,
    email: string,
}

interface EditModalProps {
    item: Datas;
    onClose: () => void;
    onUserUpdate: (updatedUser: Datas) => void;
}


const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditModal = ({ item, onClose, onUserUpdate }: EditModalProps) => {
    const adminContext = useContext(AdminContext);
    const adminToken = useSelector((state: any) => state.adminToken);
    const dispatch = useDispatch();
    const { _id, name: initialName, username : initialUsername, email: initialEmail } = item;
    const [input, setInput] = useState({
        _id: _id,
        name: initialName,
        username: initialUsername,
        email: initialEmail,
    });
    const [message, setMessage] = useState('');
    const [msgType,setMsgType] = useState('green')

    const updateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!input.name || !input.email) {
            setMessage('All fields are required');
            setMsgType('red');
            return;
        }

        if(input.name.trim() === ''){
            setMessage('Enter proper name');
            setMsgType('red');
            return
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(input.email)) {
            setMessage('Please enter a valid email address');
            setMsgType('red');
            return;
        }
        const obj = {
            id: _id,
            name: input.name,
            username : input.username,
            email: input.email,
        };
        const newAccessToken = await adminAuth(adminToken);
        if (newAccessToken) {
            setMessage('')
            dispatch(setAdminToken(newAccessToken));
            Cookies.set('adminAccessToken', newAccessToken);

            const response = await fetch(`${BASE_URL}/admin/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newAccessToken}`,
                },
                body: JSON.stringify(obj),
            });

            if (response.status === 401) {
                alert('Error updating user');
            } else {
                const result = await response.json();
                console.log(result.message);
                onUserUpdate({ _id, name: input.name, username : input.username, email: input.email });
                onClose();
            }
        } else {
            adminContext?.logout();
        }
    };

    return (
        <>
            <div className="modalc-overlay" onClick={onClose}></div>
            <div className="modalc">
                <h1>Edit User</h1>
                <p style={{ color : msgType === 'red' ? 'red' :'green'}}>{message}</p>
                <form onSubmit={updateSubmit}>
                    <input type="hidden" name="id" value={input._id} />
                    <input
                        type="text"
                        name="name"
                        onChange={updateInput}
                        value={input.name}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        name="username"
                        onChange={updateInput}
                        value={input.username}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        name="email"
                        onChange={updateInput}
                        value={input.email}
                        placeholder="Email"
                    />
                    <button type="submit">Submit</button>
                </form>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
};

export default EditModal;
