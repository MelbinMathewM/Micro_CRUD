import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const isTokenExpired = ( token : string ) => {
    if(!token) return true;
    const decodedStr : any = jwtDecode(token);
    return decodedStr.exp * 1000 < Date.now();
}


const BASE_URL = import.meta.env.VITE_BASE_URL;

async function refreshAccessToken() {
    const refreshToken = Cookies.get('adminRefreshToken');
    console.log(refreshToken,'mm')
    if (refreshToken) {
        try {
            const resp = await fetch(`${BASE_URL}/auth/admin/refresh_token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });
            if (resp.status === 401) {
                return null;
            } else {
                const data = await resp.json();
                return data.accessToken;
            }
        } catch (err) {
            return null;
        }
    } else {
        return null;
    }
}


export const verifyToken = async (accessToken: string) => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (res.status === 401) {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                return newAccessToken;
            } else {
                return null;
            }
        }
        return accessToken;
    } catch (err) {
        console.error('Error verifying token:', err);
        return null;
    }
};

export async function adminAuth(accessToken : string) {
    if(isTokenExpired(accessToken)){
        const newAccessToken = await refreshAccessToken();
        if(newAccessToken){
            return newAccessToken;
        }
        return null;
    }else{
        const verifiedToken = await verifyToken(accessToken);
        return verifiedToken;
    }
}