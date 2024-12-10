import { useContext, useEffect, useState } from "react";
import Navbar from "../../../Components/Users/Navbar/Navbar";
import { UserContext } from "../../../context/userContext";
import { useDispatch, useSelector } from "react-redux";
import EditModal from "../../../Components/Users/Edit/Edit";
import './Home.css'
import user_default_icon from '../../../assets/user_default_icon.png'
import { userAuth } from "../../../auth/userAuth";
import { setUserToken } from "../../../redux/store";
import Cookies from "js-cookie";
import { FaPencilAlt } from 'react-icons/fa';

const Home = () => {
    const userContext = useContext(UserContext);
    const userToken = useSelector((state: any) => state.userToken);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [inputs, setInputs] = useState({
        _id: '',
        name: '',
        username : '',
        email: ''
    });
    const [imageUrl,setImageUrl] = useState<string>(user_default_icon);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [isForm, setIsForm] = useState<boolean>(false)

    useEffect(() => {
        if (user && user._id) {
            setInputs({
                _id: user._id,
                name: user.name,
                username : user.username,
                email: user.email,
            });
            setImageUrl(user.imageUrl || user_default_icon)
        }
    }, [user]);

    const handleClose = () => {
        setIsEditModalOpen(false);
    }

    const handleOpen = () => {
        setIsEditModalOpen(true);
    }

    const handleForm = () => {
        setIsForm(!isForm)
    }

    const handleUpload = (event : React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if(file){
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result as string)
                setImageBase64(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const obj = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            image : imageBase64
        };
        const newAccessToken = await userAuth(userToken);
        if (newAccessToken) {
            dispatch(setUserToken(newAccessToken));
            Cookies.set('adminAccessToken', newAccessToken);

            const response = await fetch('http://localhost:3000/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newAccessToken}`
                },
                body: JSON.stringify(obj)
            });
            if (response.status === 401) {
                alert('Error when fetching');
            } else {
                const result = await response.json();
                setInputs({
                    _id: obj.id,
                    name: obj.name,
                    username : obj.username,
                    email: obj.email
                });
                setIsForm(false)
                console.log(result.message);
            }
        } else {
            userContext?.logout();
        }
    }

    return (
        <div>
            <Navbar />
            <div className="home-div">
                <div className="profile-pic-container">
                    <img src={imageUrl} alt="User Profile" className="profile-pic" />
                    <FaPencilAlt className="edit-icon" onClick={handleForm} />
                </div>
                { isForm && 
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        id="image-upload"
                        name="image"
                        onChange={handleUpload}
                    />
                    <button id="img-form-btn" type="submit">Upload</button>
                </form>}
                <p>{inputs.name}</p>
                <p>{inputs.email}</p>
                <button onClick={handleOpen}>Edit</button>
            </div>
            {isEditModalOpen && <EditModal item={inputs} setInputs={setInputs} onClose={handleClose} />}
        </div>
    );
}

export default Home;
