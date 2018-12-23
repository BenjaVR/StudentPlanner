import { Action, Dispatch } from "redux";
import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import { SchoolsService } from "../../../services/SchoolsService";

interface IAddSchoolStartedAction extends Action {
    type: "ADD_SCHOOL_STARTED";
}

interface IAddSchoolSuccessAction extends Action {
    type: "ADD_SCHOOL_SUCCESS";
    payload: {
        school: ISchool;
    }
}

interface IAddSchoolFailureAction extends Action {
    type: "ADD_SCHOOL_FAILURE";
    payload: {
        error: string;
    }
}

export type AddSchoolAction =
    IAddSchoolStartedAction |
    IAddSchoolSuccessAction |
    IAddSchoolFailureAction;

function actionAddSchoolStarted(): IAddSchoolStartedAction {
    return {
        type: "ADD_SCHOOL_STARTED",
    };
}

function actionAddSchoolSuccess(school: ISchool): IAddSchoolSuccessAction {
    return {
        type: "ADD_SCHOOL_SUCCESS",
        payload: {
            school,
        },
    };
}

function actionAddSchoolFailure(error: string): IAddSchoolFailureAction {
    return {
        type: "ADD_SCHOOL_FAILURE",
        payload: {
            error,
        },
    };
}

export function addSchool(school: ISchool): (d: Dispatch) => void {
    return (dispatch: Dispatch) => {
        dispatch(actionAddSchoolStarted());

        SchoolsService.getInstance().addSchool(school)
            .then((school: ISchool) => {
                return dispatch(actionAddSchoolSuccess(school));
            })
            .catch((error: firebase.functions.HttpsError) => {
                console.log(error.details);
                return dispatch(actionAddSchoolFailure(error.message));
            });
    };
}
