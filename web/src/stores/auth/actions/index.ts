import {  checkLoggedIn, CheckLoggedInAction } from "./checkLoggedInAction";
import { login, LoginAction } from "./loginAction";
import { logout, LogoutAction } from "./logoutAction";

export type AuthAction =
    LoginAction |
    LogoutAction |
    CheckLoggedInAction;

export {
    login,
    logout,
    checkLoggedIn,
};
