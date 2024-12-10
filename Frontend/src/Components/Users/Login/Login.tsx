import React, { useContext, useState } from "react"
import './Login.css';
import { useDispatch } from "react-redux";
import { UserContext } from "../../../context/userContext";
import Cookies from "js-cookie";
import { setUserToken, updateUser } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

interface Obj {
    name : string,
    username : string,
    email : string,
    password : string,
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const LoginContainer = () => {

    const dispatch = useDispatch();
    const userContext = useContext(UserContext);
    const [login,setLogin] = useState<boolean>(true);
    const [input, setInput] = useState<Obj>({
        name : '',
        username : '',
        email : '',
        password : ''
    });
    const navigate = useNavigate();
    const [error,setError] = useState<string>('')
    const [message,setMessage] = useState<string>('')
    const [msgType, setMsgType] = useState<string>('green')

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name] : value
        }))
    }

    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault();
        if(login){
            if (!input.password || !input.email) {
                setMessage('All fields are required');
                setMsgType('red');
                return;
            }
            const obj = {
                username : input.username,
                password : input.password
            }
            try{
                setMessage('')
                fetch(`${BASE_URL}/auth/login`,{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(obj)
                })
                .then(async(res) => {
                    console.log(res)
                    return await res.json()
                })
                .then((data) => {
                    console.log(data,'hh')
                    if(data.accessToken && data.refreshToken){
                        setInput({
                            name : '',
                            username : '',
                            email : '',
                            password : ''
                        })
                        Cookies.set('accessToken',data.accessToken);
                        Cookies.set('refreshToken',data.refreshToken);
                        dispatch(setUserToken(data.accessToken));
                        setError('')
                        userContext?.setIsAuth(true);
                        navigate('/home')
                    }else{
                        setError(data.message)
                    }
                })
            }catch(err){
                console.log(err)
            }

        }else{
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
                name : input.name,
                username : input.username,
                email : input.email,
                password : input.password
            }
            try{
                fetch(`${BASE_URL}/auth/register`,{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(obj)
                })
                .then(async(res) => {
                    return await res.text();
                })
                .then((data) => {
                    setMessage(data)
                    setError('')
                    navigate('/login');
                    setLogin(!login)
                })
            }catch(err){
                console.log(err)
            }
        }
    } 

    return (
        <div className="login-container">
            <h2>{login ? 'Login' : 'Register'}</h2>
            <p style={{color : 'red'}}>{error}</p>
            <p style={{ color : msgType === 'red' ? 'red' :'green'}}>{message}</p>
            <form onSubmit={handleSubmit}>
                { !login && 
                <input type="text" name="name" value={input.name} onChange={handleInput} placeholder="Enter name"/> }
                <input type="text" name="username" value={input.username} onChange={handleInput} placeholder="Enter username"/>
                <input type="email" name="email" value={input.email} onChange={handleInput} placeholder="Enter email"/>
                <input type="password" name="password" value={input.password} onChange={handleInput} placeholder="Enter password" required/>
                <button type="submit" >Submit</button>
                <span onClick={() => setLogin(!login)}>{login ? 'Don\'t have an account? Sign Up' : 'Already have an Account? Log In'}</span>
            </form>
        </div>
    )
}

export default LoginContainer;