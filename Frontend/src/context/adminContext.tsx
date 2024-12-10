import { createContext, ReactNode, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminAuth } from "../auth/adminAuth";
import Cookies from "js-cookie";
import { setAdminToken, updateAdmin } from "../redux/store";

interface contextType {
    isAuth : boolean;
    setIsAuth : React.Dispatch<React.SetStateAction<boolean>>;
    logout : () => void;
}


const BASE_URL = import.meta.env.VITE_BASE_URL;

const AdminContext = createContext<contextType | null>(null);

const AdminProvider = ( { children } : { children : ReactNode }) => {

    const accessToken = useSelector((state : any) => state.adminToken);

    const dispatch = useDispatch();

    const [isAuth, setIsAuth] = useState<boolean>(accessToken ? true : false);

    useLayoutEffect(() => {
        const checkAdminAuth = async () => {
            const newAccessToken = await adminAuth(accessToken);
            if (newAccessToken) {
                dispatch(setAdminToken(newAccessToken));
                Cookies.set('adminAccessToken', newAccessToken);
        
                try {
                    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${newAccessToken}`
                        }
                    });
        
                    if (res.status === 401) {
                        checkAdminAuth();
                    } else {
                        const data = await res.json();
                        dispatch(updateAdmin(data.admin));
                    }
                } catch (error) {
                    console.error('Error fetching admin dashboard:', error);
                }
            } else {
                logout();
            }
        };
        checkAdminAuth();
    }, [isAuth])

    const logout = () => {
        dispatch(setAdminToken(null));
        dispatch(updateAdmin(null));
        Cookies.remove('adminAccessToken');
        Cookies.remove('adminRefreshToken');
        setIsAuth(false);
    }

    return (
        <AdminContext.Provider value={{ isAuth, setIsAuth, logout }}>
            {children}
        </AdminContext.Provider>
    )
}

export { 
    AdminContext,
    AdminProvider,
}

export type { contextType };