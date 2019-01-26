import { IEducation } from "studentplanner-functions/shared/contract/IEducation";
import { FirebaseModel } from "./FirebaseModel";

class Education extends FirebaseModel<IEducation> {

    public name: string;

    constructor(dto: IEducation) {
        super(dto);
        this.name = dto.name;
    }

    public getDto(): IEducation {
        return {
            name: this.name,
        };
    }
}

export { Education };
