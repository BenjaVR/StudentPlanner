import { Action, Dispatch } from "redux";
import { Firebase } from "../../../services/firebase/FirebaseInitializer";

interface ILogoutStartedAction extends Action {
    type: "LOGOUT_STARTED";
}

interface ILogoutSuccessAction extends Action {
    type: "LOGOUT_SUCCESS";
}

interface ILogoutFailureAction extends Action {
    type: "LOGOUT_FAILURE";
    payload: {
        errorCode: string;
        errorMessage: string;
    };
}

export type LogoutAction =
    ILogoutStartedAction |
    ILogoutSuccessAction |
    ILogoutFailureAction;

function actionLogoutStarted(): ILogoutStartedAction {
    return {
        type: "LOGOUT_STARTED",
    };
}

function actionLogoutSuccess(): ILogoutSuccessAction {
    return {
        type: "LOGOUT_SUCCESS",
    };
}

function actionLogoutFailure(error: firebase.FirebaseError): ILogoutFailureAction {
    return {
        type: "LOGOUT_FAILURE",
        payload: {
            errorCode: error.code,
            errorMessage: error.message,
        },
    };
}

export function logout(): (d: Dispatch) => void {
    return (dispatch: Dispatch) => {
        dispatch(actionLogoutStarted());

        Firebase.auth().signOut()
            .then(() => {
                return dispatch(actionLogoutSuccess());
            })
            .catch((error: firebase.FirebaseError) => {
                return dispatch(actionLogoutFailure(error));
            });
    };
}
