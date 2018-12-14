import firebase from "firebase";
import { LoginAction } from "./loginActions";
import { LogoutAction } from "./logoutActions";

type AuthAction =
    LoginAction |
    LogoutAction;

type AuthStatus =
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
    switch(action.type) {
        case "LOGIN_STARTED":
            return {
                ...state,
                status: "AUTHENTICATING",
            };

        case "LOGIN_SUCCESS":
            return {
                ...state,
                status: "AUTHENTICATED",
                user: action.payload.user,
            };

        case "LOGIN_FAILURE":
            return {
                ...state,
                status: "NOT_AUTHENTICATED",
                user: undefined,
            };

        case "LOGOUT_STARTED":
            return state;

        case "LOGOUT_SUCCESS":
            return {
                ...state,
                status: "NOT_AUTHENTICATED",
                user: undefined,
            };

        case "LOGOUT_FAILURE":
            return {
                ...state,
                status: "NOT_AUTHENTICATED",
                user: undefined,
            };

        default:
            return state;
    }
}
