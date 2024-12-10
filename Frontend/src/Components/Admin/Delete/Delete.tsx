import { useSelector } from "react-redux"
import { AdminContext } from "../../../context/adminContext"
import { adminAuth } from "../../../auth/adminAuth";
import { useContext, useState } from "react";
import './Delete.css'

interface Datas {
    _id : string,
    name : string,
    email : string
}

interface DeleteModalProps {
    item: Datas;
    onClose: () => void;
    onUserDelete: (userId: string) => void;
}


const BASE_URL = import.meta.env.VITE_BASE_URL;

const DeleteModal = ({ item, onClose, onUserDelete }: DeleteModalProps ) => {

    const adminToken = useSelector((state: any) => state.adminToken);
    const [error, setError] = useState<string>('');

    const handleDelete = async () => {
        const response = await fetch(`${BASE_URL}/admin/remove?userId=${item._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
        });

        if (response.ok) {
            onUserDelete(item._id);
            onClose();
        } else {
            setError('error deleting user');
        }
    };

    return (
        <>
            <div className="modalc-overlay" onClick={onClose}></div>
            <div className="modalc">
                <h1>Are you sure you want to delete {item.name}?</h1>
                <p>{error}</p>
                <div className="modal-actions">
                    <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </>
    );
};

export default DeleteModal;
