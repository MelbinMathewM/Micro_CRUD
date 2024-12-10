import { useContext, useState } from "react";
import './LoginContainer.css';
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAdminToken } from "../../../redux/store";
import { AdminContext } from "../../../context/adminContext";
import { useNavigate } from "react-router-dom";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const LoginContainer = () => {
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const [isLogin,setIsLogin] = useState<boolean>(false);
    const [error, setError] = useState<string>('')
    const adminContext = useContext(AdminContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [msgType,setMsgType] = useState('green')

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        if(name){
            setInput({
                ...input,
                [name] : value
            })
        }
    }

    const dispatch = useDispatch();

    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault();

        if (!input.password || !input.email) {
            setMessage('All fields are required');
            setMsgType('red');
            return;
        }
        
        // Email format validation (simple regex check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(input.email)) {
            setMessage('Please enter a valid email address');
            setMsgType('red');
            return;
        }
        
        const obj = {
            email : input.email,
            password : input.password
        }
        setIsLogin(true);
        setMessage('')
        fetch(`${BASE_URL}/auth/admin/login`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(obj)
        })
        .then(async(res) => {
            return await res.json();
        })
        .then((data) => {
            if(data.accessToken && data.refreshToken){
                setInput({
                    email : '',
                    password : ''
                })
                Cookies.set('adminAccessToken',data.accessToken);
                Cookies.set('adminRefreshToken',data.refreshToken);
                dispatch(setAdminToken(data.accessToken));
                adminContext?.setIsAuth(true);
                navigate('/admin/dashboard');
            }else{
                setIsLogin(false);
                setError(data.message)
            }
        })
        .catch((err) => {
            setIsLogin(false);
            console.log(err);
        })
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <p style={{ color : msgType === 'red' ? 'red' :'green'}}>{message}</p>
            <p style={{color:'red'}}>{error}</p>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={input.email} onChange={handleInput} placeholder="Enter Email" />
                <input type="password" name="password" value={input.password} onChange={handleInput} placeholder="Enter Password" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default LoginContainer;