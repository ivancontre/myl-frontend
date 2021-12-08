import { Deck } from "../deck/types";

export const authLogin = '[auth] Login';
export const authStartRegister = '[auth] Start Register';
export const authChecking = '[auth] Cheking login state';
export const authCheckingFinish = '[auth] Finish checking login state';
export const authLogout = '[auth] Logout';
export const authStartRenewToken = '[auth] Start renew token';
export const authStartSetDetail = '[auth] Start get detail'; // playing, defeats, victories
export const authStartUpdateData = '[auth] Start Update data';

export type User = {
    id: string;
    name: string;
    lastname: string;
    email: string;
    username: string;
    role: string;
    status: boolean;
    online?: boolean;
    playing?: boolean;
    victories?: number;
    defeats?: number;
    decks?: Deck[]
};

export type AuthState = Partial<User> & {
    checking: boolean;
    logged: boolean;
};

type AuthLogin = {    
    type: typeof authLogin,
    payload: User
};

type AuthCheckingFinish = {    
    type: typeof authCheckingFinish
};

type AuthLogout = {    
    type: typeof authLogout
};

type AuthStartSetDetail = {
    type: typeof authStartSetDetail,
    payload: any
};

type AuthStartUpdateData = {
    type: typeof authStartUpdateData,
    payload: any
};

export type AuthActionTypes = AuthLogin | AuthCheckingFinish | AuthLogout | AuthStartSetDetail | AuthStartUpdateData;