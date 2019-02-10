import moment from "moment";
import { IStudent } from "../entities/IStudent";
import { Firebase } from "../services/FirebaseInitializer";
import { ModelBase } from "./ModelBase";

export interface IStudentInternship {
    startDate: moment.Moment;
    endDate: moment.Moment;
    hours: number;
    departmentId: string | undefined;
}

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
        public schoolId: string | undefined,
        public educationId: string | undefined,
        public isPlanned: boolean,
        public internship: IStudentInternship | undefined,
    ) {
        super();
    }

    public static fromEntity(entity: IStudent): Student {
        const student = new Student(
            entity.firstName,
            entity.lastName,
            entity.isConfirmed,
            entity.schoolId,
            entity.educationId,
            entity.isPlanned,
            entity.internship === undefined
                ? undefined
                : {
                    startDate: moment(entity.internship.startDate.toDate()),
                    endDate: moment(entity.internship.endDate.toDate()),
                    hours: entity.internship.hours,
                    departmentId: entity.internship.departmentId,
                },
        );
        student.fillBaseFields(entity);
        return student;
    }

    protected getEntityInternal(): IStudent {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            isConfirmed: this.isConfirmed || false,
            schoolId: this.schoolId,
            educationId: this.educationId,
            isPlanned: this.isPlanned,
            internship: this.internship === undefined
                ? undefined
                : {
                    startDate: Firebase.firestore.Timestamp.fromDate(
                        this.internship.startDate.startOf("day").toDate(),
                    ),
                    endDate: Firebase.firestore.Timestamp.fromDate(
                        this.internship.endDate.startOf("day").toDate(),
                    ),
                    hours: this.internship.hours,
                    departmentId: this.internship.departmentId,
                },
        };
    }
}
