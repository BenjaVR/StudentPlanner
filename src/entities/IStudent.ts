import { IFirestoreEntityBase } from "./IFirestoreEntityBase";

export interface IStudent extends IFirestoreEntityBase {
    firstName: string;
    lastName: string | undefined;
    isConfirmed: boolean;
    schoolId: string | undefined;
    educationId: string | undefined;
    isPlanned: boolean;
    internship: IInternship | undefined;
}

export interface IInternship {
    startDate: firebase.firestore.Timestamp;
    endDate: firebase.firestore.Timestamp;
    hours: number;
    departmentId: string | undefined;
}
