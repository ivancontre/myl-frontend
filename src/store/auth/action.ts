import { Dispatch } from "react";
import { runFetch } from "../../helpers/fetch";
import { AuthActionTypes, 
        authCheckingFinish, 
        authLogin, 
        authLogout, 
        User 
} from "./types";

export const startLogin = (email: string, password: string) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {
            const resp = await runFetch('api/auth/login', { email, password }, 'POST');
            const respJson = await resp.json();

            if (resp.status === 200) {
                localStorage.setItem('token', respJson.token);
                localStorage.setItem('token-init-date', new Date().getTime().toString());

                dispatch(login({
                    _id: respJson.user.id,
                    name: respJson.user.name,
                    lastname: respJson.user.lastname,
                    email: respJson.user.email,
                    username: respJson.user.username
                }));

            } else {
                console.log(respJson.msg)
            }
            
        } catch (error) {
            console.log(error);
        }
        
    }
};

export const startRegister = (name: string, lastname: string, email: string, username: string, password: string) => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {
            const resp = await runFetch('api/auth/register', { name, lastname, email, username, password }, 'POST');
            const respJson = await resp.json();

            if (resp.status === 201) {
                localStorage.setItem('token', respJson.token);
                localStorage.setItem('token-init-date', new Date().getTime().toString());

                dispatch(login({
                    _id: respJson.user.id,
                    name: respJson.user.name,
                    lastname: respJson.user.lastname,
                    email: respJson.user.email,
                    username: respJson.user.username
                }));

            } else {
                console.log(respJson.msg)
            }
        } catch (error) {
            console.log(error);
        }
        
    }
};

export const startChecking = () => {
    return async (dispatch: Dispatch<AuthActionTypes>) => {

        try {
            const token = localStorage.getItem('token') as string;


            if (!token) {
                dispatch(logout());
            }

            const resp = await runFetch('api/auth/renew-token',  {}, 'GET', token);
            const respJson = await resp.json();

            if (resp.status === 200) {
                localStorage.setItem('token', respJson.token);
                localStorage.setItem('token-init-date', new Date().getTime().toString());

                dispatch(login({
                    _id: respJson.user.id,
                    name: respJson.user.name,
                    lastname: respJson.user.lastname,
                    email: respJson.user.email,
                    username: respJson.user.username
                }));

            } else {
                dispatch(logout());
            }
        } catch (error) {
            console.log(error);
        }        

    }   
};

export const startLogout = () => {
    return (dispatch: Dispatch<AuthActionTypes>) => {
        localStorage.clear();
        dispatch(logout());
    }
};

const checkingFinish = (): AuthActionTypes => {
    return {
        type: authCheckingFinish
    }
};

const login = (user: User): AuthActionTypes => {
    return {
        type: authLogin,
        payload: user
    }
};

const logout = (): AuthActionTypes => {
    return {
        type: authLogout
    }
};