import { IDepartment, IDepartmentEducationCapacity } from "studentplanner-functions/shared/contract/IDepartment";
import { FirebaseModel } from "./FirebaseModel";

class Department extends FirebaseModel<IDepartment> {

    public name: string;
    public capacityPerEducation: IDepartmentEducationCapacity[];

    constructor(dto: IDepartment) {
        super(dto);
        this.name = dto.name;
        this.capacityPerEducation = dto.capacityPerEducation;
    }

    public getDto(): IDepartment {
        return {
            name: this.name,
            capacityPerEducation: this.capacityPerEducation,
        };
    }
}

export { Department };
