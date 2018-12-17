import firebase from "firebase";
import { AuthAction } from "./actions";

export type AuthStatus =
    "CHECKING_LOGGED_IN" |
    "LOGGING_IN" |
    "LOGGED_IN" |
    "LOGGING_OUT" |
    "LOGGED_OUT";

export interface IAuthState {
    readonly status: AuthStatus;
    readonly user: firebase.User | undefined;
}

const initialState: IAuthState = {
    status: "LOGGED_OUT",
    user: undefined,
};

export function authReducer(state: IAuthState = initialState, action: AuthAction): IAuthState {
    switch (action.type) {
        case "CHECKLOGGEDIN_INITIAL":
            return {
                ...state,
                status: "CHECKING_LOGGED_IN",
            };

        case "LOGIN_STARTED":
            return {
                ...state,
                status: "LOGGING_IN",
            };

        case "CHECKLOGGEDIN_LOGGEDIN":
        case "LOGIN_SUCCESS":
            return {
                ...state,
                status: "LOGGED_IN",
                user: action.payload.user,
            };

        case "CHECKLOGGEDIN_LOGGEDOUT":
        case "LOGIN_FAILURE":
        case "LOGOUT_SUCCESS":
        case "LOGOUT_FAILURE":
            return {
                ...state,
                status: "LOGGED_OUT",
                user: undefined,
            };

        case "LOGOUT_STARTED":
            return {
                ...state,
                status: "LOGGING_OUT",
            };

        case "LOGIN_IGNORED":
        default:
            return state;
    }
}
