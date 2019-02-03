import { IFirestoreEntityBase } from "./IFirestoreEntityBase";

export interface IStudent extends IFirestoreEntityBase {
    firstName: string;
    lastName: string | undefined;
    isConfirmed: boolean;
    isPlanned: boolean;
    isArchived: boolean;
    schoolId: string | undefined;
    educationId: string | undefined;
}
