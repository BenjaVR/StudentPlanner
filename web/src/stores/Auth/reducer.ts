import firebase from "firebase";
import { CheckLoggedInAction } from "./checkLoggedInAction";
import { LoginAction } from "./loginActions";
import { LogoutAction } from "./logoutActions";

type AuthAction =
    LoginAction |
    LogoutAction |
    CheckLoggedInAction ;

export type AuthStatus =
    "INITIAL_AUTH_CHECKING" |
    "NOT_AUTHENTICATED" |
    "AUTHENTICATING" |
    "AUTHENTICATED";

export interface IAuthState {
    readonly status: AuthStatus;
    readonly user: firebase.User | undefined;
}

const initialState: IAuthState = {
    status: "NOT_AUTHENTICATED",
    user: undefined,
};

export function authReducer(state: IAuthState = initialState, action: AuthAction): IAuthState {
    switch (action.type) {
        case "CHECKLOGGEDIN_INITIAL":
            return {
                ...state,
                status: "INITIAL_AUTH_CHECKING",
            };

        case "LOGIN_STARTED":
            return {
                ...state,
                status: "AUTHENTICATING",
            };

        case "CHECKLOGGEDIN_LOGGEDIN":
        case "LOGIN_SUCCESS":
            return {
                ...state,
                status: "AUTHENTICATED",
                user: action.payload.user,
            };

        case "CHECKLOGGEDIN_LOGGEDOUT":
        case "LOGIN_FAILURE":
        case "LOGOUT_SUCCESS":
        case "LOGOUT_FAILURE":
            return {
                ...state,
                status: "NOT_AUTHENTICATED",
                user: undefined,
            };

        case "LOGIN_IGNORED":
        case "LOGOUT_STARTED":
        default:
            return state;
    }
}
