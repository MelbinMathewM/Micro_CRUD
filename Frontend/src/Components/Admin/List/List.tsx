import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../Delete/Delete";
import EditModal from "../Edit/Edit";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { AdminContext } from "../../../context/adminContext";
import { adminAuth } from "../../../auth/adminAuth";
import { setAdminToken } from "../../../redux/store";
import Cookies from "js-cookie";
import user_default_icon from '../../../assets/user_default_icon.png'
import './List.css'

interface Datas {
    _id: string,
    name: string,
    username: string,
    email: string,
    imageUrl? : string
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserList = () => {
    const accessToken = useSelector((state: any) => state.adminToken);
    const dispatch = useDispatch();
    const adminContext = useContext(AdminContext);
    const [users, setUsers] = useState<Datas[] | null>(null);
    const [isEditUserId, setIsEditUserId] = useState<string | null>(null);
    const [isDeleteUserId, setIsDeleteUserId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<Datas[]>([]);

    useLayoutEffect(() => {
        const fetchUserList = async () => {
            const newAccessToken = await adminAuth(accessToken);
            if (newAccessToken) {
                dispatch(setAdminToken(newAccessToken));
                Cookies.set('adminAccessToken', newAccessToken);

                const response = await fetch(`${BASE_URL}/admin/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                });
                if (response.status === 401) {
                    alert('Error fetching users');
                    fetchUserList();
                } else {
                    const result = await response.json();
                    setUsers(result.users);
                    setFilteredUsers(result.users);
                }
            } else {
                adminContext?.logout();
            }
        };
        fetchUserList();
    }, [accessToken, dispatch, adminContext]);

    useEffect(() => {
        if (users) {
            const result = users.filter(item => {
                return item.name.toLowerCase().startsWith(search.toLowerCase()) || item.email.toLowerCase().startsWith(search.toLowerCase());
            });
            setFilteredUsers(result);
        }
    }, [search, users]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleUserUpdate = (updatedUser: Datas) => {
        setUsers((prevUsers) => prevUsers?.map(user => user._id === updatedUser._id ? updatedUser : user) || []);
    };

    const handleUserDelete = (userId: string) => {
        setUsers((prevUsers) => prevUsers?.filter(user => user._id !== userId) || []);
    };

    return (
        <div className="user-list-container">
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="search"
                    name="search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Enter something..."
                />
                <button>Search</button>
            </form>
            <div className="user-cards">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((item) => (
                        <div className="user-card" key={item._id}>
                            <img src={item.imageUrl ? item.imageUrl : user_default_icon} alt={item.name} className="admin-img"/>
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                            <div className="user-card-actions">
                                <button className="edit-btn" onClick={() => setIsEditUserId(item._id)}>Edit</button>
                                <button className="delete-btn" onClick={() => setIsDeleteUserId(item._id)}>Delete</button>
                            </div>
                            {isEditUserId === item._id && (
                                <>
                                    <EditModal
                                        item={item} 
                                        onClose={() => setIsEditUserId(null)} 
                                        onUserUpdate={handleUserUpdate} 
                                    />
                                </>
                            )}
                            {isDeleteUserId === item._id && (
                                <>
                                    <DeleteModal
                                        item={item} 
                                        onClose={() => setIsDeleteUserId(null)} 
                                        onUserDelete={handleUserDelete} 
                                    />
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No users</p>
                )}
            </div>
        </div>
    );
};

export default UserList;
