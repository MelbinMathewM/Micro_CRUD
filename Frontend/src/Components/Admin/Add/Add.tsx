import { useContext, useState } from "react";
import { AdminContext } from "../../../context/adminContext";
import { useSelector } from "react-redux";
import { adminAuth } from "../../../auth/adminAuth";
import { useNavigate } from "react-router-dom";
import './Add.css'


const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddComponent = () => {
    const adminContext = useContext(AdminContext);
    const navigate = useNavigate();
    const accessToken = useSelector((state : any) => state.adminToken);
    const [input, setInput] = useState({
        name : '',
        username : '',
        email : '',
        password : ''
    });
    const [message, setMessage] = useState('');
    const [msgType,setMsgType] = useState('green')

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name] : value
        }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!input.name || !input.email || !input.password) {
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
    
        if (input.password.length < 6 && input.password.trim() !== '') {
            setMessage('Password must be at least 6 characters long');
            setMsgType('red');
            return;
        }

        if (input.password.trim().length < 6) {
            setMessage('Password must be at least 6 characters long');
            setMsgType('red');
            return;
        }
        

    
        const obj = {
            name: input.name,
            username : input.username,
            email: input.email,
            password: input.password
        };
    
        try {
            const newAccessToken = await adminAuth(accessToken);
            if (newAccessToken) {
                setMessage('')
                const response = await fetch(`${BASE_URL}/admin/insert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newAccessToken}`
                    },
                    body: JSON.stringify(obj)
                });
    
                if (response.status === 401) {
                    setMessage('Error adding user');
                    setMsgType('red');
                } else {
                    const result = await response.json();
                    setMessage(result.message);
                    setMsgType('green');
                    setTimeout(() => {
                        navigate('/admin/users');
                    }, 1000);
                }
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
            setMsgType('red');
            console.error(error);
        }
    };
    

    return (
        <div className="add-comp">
            <h1>Add User</h1>
            <p style={{ color : msgType === 'red' ? 'red' :'green'}}>{message}</p>
            <form id="addadminform" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleInput}
                    placeholder="Enter name"
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={input.username}
                    onChange={handleInput}
                    placeholder="Enter username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={handleInput}
                    placeholder="Enter email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleInput}
                    placeholder="Enter password"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddComponent;