import { ILoginDetails } from "@studentplanner/functions/dist/shared/models/LoginDetails";
import firebase from "firebase";
import { Action, Dispatch } from "redux";
import { Firebase } from "../../../config/FirebaseInitializer";

interface ILoginStartedAction extends Action {
    type: "LOGIN_STARTED";
}

interface ILoginSuccessAction extends Action {
    type: "LOGIN_SUCCESS";
    payload: {
        user: firebase.User;
    };
}

interface ILoginFailureAction extends Action {
    type: "LOGIN_FAILURE";
    payload: {
        errorCode: string;
        errorMessage: string;
    };
}

interface ILoginIgnoredAction extends Action {
    type: "LOGIN_IGNORED";
}

export type LoginAction =
    ILoginStartedAction |
    ILoginSuccessAction |
    ILoginFailureAction |
    ILoginIgnoredAction;

function actionLoginStarted(): ILoginStartedAction {
    return {
        type: "LOGIN_STARTED",
    };
}

function actionLoginSuccess(user: firebase.User): ILoginSuccessAction {
    return {
        type: "LOGIN_SUCCESS",
        payload: {
            user,
        },
    };
}

function actionLoginFailure(error: firebase.FirebaseError): ILoginFailureAction {
    return {
        type: "LOGIN_FAILURE",
        payload: {
            errorCode: error.code,
            errorMessage: error.message,
        },
    };
}

function actionLoginIgnored(): ILoginIgnoredAction {
    return {
        type: "LOGIN_IGNORED",
    };
}

export function login(loginDetails: ILoginDetails): (d: Dispatch) => void {
    return (dispatch: Dispatch) => {
        // Do not attempt to log in if the user is already logged in.
        if (Firebase.auth().currentUser != null) {
            return dispatch(actionLoginIgnored());
        }

        dispatch(actionLoginStarted());

        Firebase.auth().signInWithEmailAndPassword(loginDetails.username, loginDetails.password)
            .then(() => {
                const user = Firebase.auth().currentUser;
                if (user === null) {
                    // TODO: action accept firebase error or string... Different action for succeeded login but user not found?
                    throw Error("Logged in user not found!");
                }
                return dispatch(actionLoginSuccess(user));
            })
            .catch((error: firebase.FirebaseError) => {
                return dispatch(actionLoginFailure(error)); // return localized error
            });
    };
}
