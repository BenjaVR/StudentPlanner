import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import { SchoolsAction } from "./actions";

export type SchoolsLoadingStatus =
    "NOT_LOADED" |
    "LOADING" |
    "LOADING_DONE" |
    "LOADING_FAILED";

export interface ISchoolsState {
    readonly schools: ISchool[];
    readonly loadingStatus: SchoolsLoadingStatus;
}

const initialState: ISchoolsState = {
    schools: [],
    loadingStatus: "NOT_LOADED",
};

export function schoolsReducer(state: ISchoolsState = initialState, action: SchoolsAction): ISchoolsState {
    switch (action.type) {
        case "FETCH_SCHOOLS_STARTED":
            return {
                ...state,
                loadingStatus: "LOADING",
            };

        case "FETCH_SCHOOLS_SUCCESS":
            return {
                ...state,
                loadingStatus: "LOADING_DONE",
                schools: action.payload.schools,
            };

        case "FETCH_SCHOOLS_FAILURE":
            return {
                ...state,
                loadingStatus: "LOADING_FAILED",
            };

        default:
            return state;
    }
}
