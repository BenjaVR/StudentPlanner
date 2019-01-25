import { IFirebaseTable } from "./IFirebaseTable";

export interface IStudent extends IFirebaseTable {
    firstName: string;
    lastName?: string;
    isConfirmed: boolean;
    isPlanned: boolean;
    schoolId?: string;
    educationId?: string;
}
