import { useContext } from "react";
import { UserContext } from "../../../context/userContext";


const Navbar = () => {

    const userContext = useContext(UserContext);
    const handleLogout = () => {
        userContext?.logout();
    }
    return (
        <div className="navbar">
            <div className="navbar-left">
                <h3>Userecom</h3>
            </div>
            <div className="navbar-right">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;