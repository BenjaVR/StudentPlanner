import { IFirestoreEntityBase } from "./IFirestoreEntityBase";

export interface IInternship extends IFirestoreEntityBase {
    startDate: firebase.firestore.Timestamp;
    endDate: firebase.firestore.Timestamp;
    hours: number;
    isArchived: boolean;
    studentId: string | undefined;
    departmentId: string | undefined;
}
