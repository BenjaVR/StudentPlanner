import { IFirebaseTable } from "./IFirebaseTable";

export interface IStudent extends IFirebaseTable {
    firstName: string;
    lastName?: string;
    schoolId?: string;
    educationId?: string;
}
