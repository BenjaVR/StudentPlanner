import firebase from "firebase";
import { Action, Dispatch } from "redux";
import { Firebase } from "../../../config/FirebaseInitializer";

interface ICheckLoggedInStartedAction extends Action {
    type: "CHECKLOGGEDIN_INITIAL";
}

interface ICheckLoggedInSuccessAction extends Action {
    type: "CHECKLOGGEDIN_LOGGEDIN";
    payload: {
        user: firebase.User;
    };
}

interface ICheckLoggedInFailureAction extends Action {
    type: "CHECKLOGGEDIN_LOGGEDOUT";
}

export type CheckLoggedInAction =
    ICheckLoggedInStartedAction |
    ICheckLoggedInSuccessAction |
    ICheckLoggedInFailureAction;

function actionCheckLoggedInStarted(): ICheckLoggedInStartedAction {
    return {
        type: "CHECKLOGGEDIN_INITIAL",
    };
}

function actionCheckLoggedInSuccess(user: firebase.User): ICheckLoggedInSuccessAction {
    return {
        type: "CHECKLOGGEDIN_LOGGEDIN",
        payload: {
            user,
        },
    };
}

function actionCheckLoggedInFailure(): ICheckLoggedInFailureAction {
    return {
        type: "CHECKLOGGEDIN_LOGGEDOUT",
    };
}

export function checkLoggedIn(): (d: Dispatch) => void {
    return (dispatch: Dispatch) => {
        dispatch(actionCheckLoggedInStarted());

        Firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
            if (user) {
                dispatch(actionCheckLoggedInSuccess(user));
            } else {
                dispatch(actionCheckLoggedInFailure());
            }
        });
    };
}
