import { IDepartment, IDepartmentEducationCapacity } from "../entities/IDepartment";
import { ModelBase } from "./ModelBase";

export class Department extends ModelBase<IDepartment> {

    constructor(
        public name: string,
        public capacityPerEducation: IDepartmentEducationCapacity[],
    ) {
        super();

        // Make sure there is an array, and no empty values are in it.
        this.capacityPerEducation = (this.capacityPerEducation || [])
            .filter((capacity) => capacity !== undefined && capacity !== null);
    }

    public static fromEntity(entity: IDepartment): Department {
        const department = new Department(
            entity.name,
            entity.capacityPerEducation,
        );
        department.fillBaseFields(entity);
        return department;
    }

    protected getEntityInternal(): IDepartment {
        return {
            name: this.name,
            capacityPerEducation: this.capacityPerEducation || [],
        };
    }
}
