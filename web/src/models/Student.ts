import { IStudent } from "../entities/IStudent";
import { ModelBase } from "./ModelBase";

export class Student extends ModelBase<IStudent> {

    public get fullName(): string {
        if (this.lastName === undefined) {
            return this.firstName;
        }
        return `${this.firstName} ${this.lastName}`;
    }

    constructor(
        public firstName: string,
        public lastName: string | undefined,
        public isConfirmed: boolean,
        public isPlanned: boolean,
        public schoolId: string | undefined,
        public educationId: string | undefined,
    ) {
        super();
    }

    public static fromEntity(entity: IStudent): Student {
        const student = new Student(
            entity.firstName,
            entity.lastName,
            entity.isConfirmed,
            entity.isPlanned,
            entity.schoolId,
            entity.educationId,
        );
        student.fillBaseFields(entity);
        return student;
    }

    protected getEntityInternal(): IStudent {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            isConfirmed: this.isConfirmed || false,
            isPlanned: this.isPlanned || false,
            schoolId: this.schoolId,
            educationId: this.educationId,
        };
    }
}
