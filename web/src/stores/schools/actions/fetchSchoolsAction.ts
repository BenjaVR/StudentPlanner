import { Action, Dispatch } from "redux";
import { ISchool } from "shared/dist/models/School";
import { SchoolsService } from "../../../services/SchoolsService";

interface IFetchSchoolsStartedAction extends Action {
    type: "FETCH_SCHOOLS_STARTED";
}

interface IFetchSchoolsSuccessAction extends Action {
    type: "FETCH_SCHOOLS_SUCCESS";
    payload: {
        schools: ISchool[];
    };
}

interface IFetchSchoolsFailureAction extends Action {
    type: "FETCH_SCHOOLS_FAILURE";
    payload: {
        error: string;
    };
}

export type FetchSchoolsAction =
    IFetchSchoolsStartedAction |
    IFetchSchoolsSuccessAction |
    IFetchSchoolsFailureAction;

function actionFetchSchoolsStarted(): IFetchSchoolsStartedAction {
    return {
        type: "FETCH_SCHOOLS_STARTED",
    };
}

function actionFetchSchoolsSuccess(schools: ISchool[]): IFetchSchoolsSuccessAction {
    return {
        type: "FETCH_SCHOOLS_SUCCESS",
        payload: {
            schools,
        },
    };
}

// TODO: error should be (own) specific object!
function actionFetchSchoolsFailure(error: string): IFetchSchoolsFailureAction {
    return {
        type: "FETCH_SCHOOLS_FAILURE",
        payload: {
            error,
        },
    };
}

export function fetchSchools(): (d: Dispatch) => void {
    return (dispatch: Dispatch) => {
        dispatch(actionFetchSchoolsStarted());

        SchoolsService.getInstance().listSchools()
            .then((schools: ISchool[]) => {
                return dispatch(actionFetchSchoolsSuccess(schools));
            })
            .catch(() => {
                // TODO: handle error arguments
                return dispatch(actionFetchSchoolsFailure("failed"));
            });
    };
}
