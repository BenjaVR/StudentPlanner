import { IFirebaseTable } from "./IFirebaseTable";

export interface IStudent extends IFirebaseTable {
    firstName: string;
    lastName?: string;
    isConfirmed: boolean;
    schoolId?: string;
    educationId?: string;
}
