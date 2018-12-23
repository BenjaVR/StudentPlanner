import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import { SchoolsAction } from "./actions";

export type SchoolsLoadingStatus =
    "NOT_LOADED" |
    "LOADING" |
    "LOADING_DONE" |
    "LOADING_FAILED";

export type SchoolAddingStatus =
    "NOTHING_ADDED" |
    "ADDING" |
    "ADDED" |
    "FAILED";

export interface ISchoolsState {
    readonly schools: ISchool[];
    readonly listLoadingStatus: SchoolsLoadingStatus;
    readonly listErrorMessage: string;
    readonly lastAddedSchool: ISchool | undefined;
    readonly addingStatus: SchoolAddingStatus;
    readonly addErrorMessage: string;
}

const initialState: ISchoolsState = {
    schools: [],
    listLoadingStatus: "NOT_LOADED",
    listErrorMessage: "",
    lastAddedSchool: undefined,
    addingStatus: "NOTHING_ADDED",
    addErrorMessage: "",
};

export function schoolsReducer(state: ISchoolsState = initialState, action: SchoolsAction): ISchoolsState {
    switch (action.type) {
        case "FETCH_SCHOOLS_STARTED":
            return {
                ...state,
                listLoadingStatus: "LOADING",
            };

        case "FETCH_SCHOOLS_SUCCESS":
            return {
                ...state,
                listLoadingStatus: "LOADING_DONE",
                schools: action.payload.schools,
                listErrorMessage: "",
            };

        case "FETCH_SCHOOLS_FAILURE":
            return {
                ...state,
                listLoadingStatus: "LOADING_FAILED",
                listErrorMessage: action.payload.error,
            };

        case "ADD_SCHOOL_STARTED":
            return {
                ...state,
                addingStatus: "ADDING"
            }

        case "ADD_SCHOOL_SUCCESS":
            state.schools.push(action.payload.school);
            return {
                ...state,
                addingStatus: "ADDED",
                lastAddedSchool: action.payload.school,
                addErrorMessage: ""
            }

        case "ADD_SCHOOL_FAILURE":
            return {
                ...state,
                addingStatus: "FAILED",
                addErrorMessage: action.payload.error,
                lastAddedSchool: undefined,
            }

        default:
            return state;
    }
}
