import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { FirebaseModel } from "./FirebaseModel";

class Student extends FirebaseModel<IStudent> {

    public firstName: string;
    public lastName: string | undefined;
    public isConfirmed: boolean;
    public isPlanned: boolean;
    public educationId: string | undefined;
    public schoolId: string | undefined;

    get fullName(): string {
        return this.lastName === undefined
            ? this.firstName
            : `${this.firstName} ${this.lastName}`;
    }

    constructor(dto: IStudent) {
        super(dto);
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.isConfirmed = dto.isConfirmed === true;
        this.isPlanned = dto.isPlanned === true;
        this.educationId = dto.educationId;
        this.schoolId = dto.schoolId;
    }

    public getDto(): IStudent {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            isConfirmed: this.isConfirmed,
            isPlanned: this.isPlanned,
            educationId: this.educationId,
            schoolId: this.schoolId,
        };
    }
}

export { Student };
