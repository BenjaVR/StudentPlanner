import { fetchSchools, FetchSchoolsAction } from "./fetchSchoolsAction";
import { AddSchoolAction, addSchool } from "./addSchoolAction";

export type SchoolsAction =
    FetchSchoolsAction |
    AddSchoolAction;

export {
    fetchSchools,
    addSchool,
};
