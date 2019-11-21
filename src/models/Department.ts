import { IDepartment, IDepartmentEducationCapacity } from "../entities/IDepartment";
import { Education } from "./Education";
import { ModelBase } from "./ModelBase";
import { Student } from "./Student";

export class Department extends ModelBase<IDepartment> {
    public get totalCapacity(): number {
        return this.capacityPerEducation
            .map((capacity) => capacity.capacity)
            .reduce((capacity, total) => capacity + total, 0);
    }

    constructor(
        public name: string,
        public color: string,
        public capacityPerEducation: IDepartmentEducationCapacity[]
    ) {
        super();

        // Make sure there is an array, and no empty values are in it.
        this.capacityPerEducation = (this.capacityPerEducation || []).filter(
            (capacity) => capacity !== undefined && capacity !== null
        );
    }

    public static fromEntity(entity: IDepartment): Department {
        const department = new Department(entity.name, entity.color, entity.capacityPerEducation);
        department.fillBaseFields(entity);
        return department;
    }

    public getUsedCapacity(students: Student[]): number {
        return students.filter((student) => {
            return student.internship !== undefined && student.internship.departmentId === this.id;
        }).length;
    }

    public getUsedCapacityForEducation(students: Student[], education: Education): number {
        return students.filter((student) => {
            return (
                student.internship !== undefined &&
                student.internship.departmentId === this.id &&
                student.educationId === education.id
            );
        }).length;
    }

    public getCapacityForEducation(education: Education): number {
        const educationCapacity = this.capacityPerEducation.find((capacity) => capacity.educationId === education.id);
        return educationCapacity === undefined ? 0 : educationCapacity.capacity;
    }

    protected getEntityInternal(): IDepartment {
        const capacities = this.capacityPerEducation || [];
        const capacitiesWithoutDuplicates = capacities.filter((capacity, index, capacitiesArray) => {
            return (
                capacitiesArray
                    .map((capacityFromArray) => capacityFromArray.educationId)
                    .indexOf(capacity.educationId) === index
            );
        });

        return {
            name: this.name,
            color: this.color,
            capacityPerEducation: capacitiesWithoutDuplicates,
        };
    }
}
