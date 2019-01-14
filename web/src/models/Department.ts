import { IFirebaseTable } from "../services/FirestoreServiceBase";

export interface IDepartment extends IFirebaseTable {
    name: string;
    capacityPerEducation: IDepartmentEducationCapacity[];
}

export interface IDepartmentEducationCapacity {
    educationId: string;
    capacity: number;
}
