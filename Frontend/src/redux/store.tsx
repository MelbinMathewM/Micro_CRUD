import { createStore, combineReducers, Reducer } from "redux";
import Cookies from 'js-cookie';

interface Action {
    type : string;
    payload : any;
}

const user : Reducer< {} | null, Action > = ( prevState = null, action ) => {
    switch(action.type){
        case 'update-user':
            return action.payload;
        default:
            return prevState;
    }
}

const initialUserCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : null;

const userToken : Reducer< string | null, Action > = ( prevState = initialUserCookie, action ) => {
    switch(action.type){
        case 'set-user-token':
            return action.payload;
        default:
            return prevState;
    }
}

const admin : Reducer< {} | null, Action > = ( prevState = null, action ) => {
    switch(action.type){
        case 'update-admin':
            return action.payload;
        default:
            return prevState
    }
}

const initialAdminCookie = Cookies.get('adminAccessToken') ? Cookies.get('adminAccessToken') : null;

console.log(initialAdminCookie);

const adminToken : Reducer< string | null, Action > = ( prevState = initialAdminCookie, action ) => {
    switch(action.type){
        case 'set-admin-token':
            if (action.payload === null) {
                console.log('adminToken being cleared');
            } else {
                console.log('adminToken being set:', action.payload);
            }
            return action.payload;
        default:
            return prevState;
    }
}

const appReducer = combineReducers({
    user,
    userToken,
    admin,
    adminToken
})

export function setUserToken( token : string | null ){
    return {
        type : 'set-user-token',
        payload : token
    }
}

export function updateUser( token : object | null ){
    return {
        type : 'update-user',
        payload : token
    }
}

export function setAdminToken( token : string | null ){
    return {
        type : 'set-admin-token',
        payload : token
    }
}

export function updateAdmin( token : object | null ){
    return {
        type : 'update-admin',
        payload : token
    }
}

const store = createStore(appReducer);
export default store;