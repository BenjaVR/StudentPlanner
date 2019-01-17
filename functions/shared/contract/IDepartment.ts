import { IFirebaseTable } from "./IFirebaseTable";

export interface IDepartment extends IFirebaseTable {
    name: string;
    capacityPerEducation: IDepartmentEducationCapacity[];
}

export interface IDepartmentEducationCapacity {
    educationId: string;
    capacity: number;
}
