import { useNavigate } from "react-router-dom"
import AddComponent from "../../../Components/Admin/Add/Add"
import Navbar from "../../../Components/Admin/Navbar/Navbar"



const Add = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/admin/users')
    }
    return (
        <div>
            <Navbar handleBack={handleBack}/>
            <AddComponent />
        </div>
    )
}

export default Add;