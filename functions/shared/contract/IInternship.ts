import { Timestamp } from "@google-cloud/firestore";
import { IFirebaseTable } from "../../dist/shared/contract/IFirebaseTable";

export interface IInternship extends IFirebaseTable {
    startDate: Timestamp;
    endDate: Timestamp;
    studentId: string;
    departmentId: number;
    hours: number;
}
