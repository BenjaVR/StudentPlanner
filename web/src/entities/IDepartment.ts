import { IFirestoreEntityBase } from "./IFirestoreEntityBase";

export interface IDepartment extends IFirestoreEntityBase {
    name: string;
    color: string;
    capacityPerEducation: IDepartmentEducationCapacity[];
}

export interface IDepartmentEducationCapacity {
    educationId: string;
    capacity: number;
}
