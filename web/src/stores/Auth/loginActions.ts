import firebase from "firebase";
import { Action, Dispatch } from "redux";
import { Firebase } from "../../services/firebase/FirebaseInitializer";

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

export type LoginAction =
    ILoginStartedAction |
    ILoginSuccessAction |
    ILoginFailureAction;

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

export function login(username: string, password: string): (d: Dispatch) => void {
    return (dispatch: Dispatch) => {
        dispatch(actionLoginStarted());

        Firebase.auth().signInWithEmailAndPassword(username, password)
            .then(() => {
                const user = Firebase.auth().currentUser;
                if (user === null) {
                    // TODO: action accept firebase error or string... Different action for succeeded login but user not found?
                    throw Error("Logged in user not found!");
                }
                return dispatch(actionLoginSuccess(user));
            })
            .catch((error: firebase.FirebaseError) => {
                return dispatch(actionLoginFailure(error));
            });
    };
}
