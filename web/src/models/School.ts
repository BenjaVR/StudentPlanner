import { ISchool } from "studentplanner-functions/shared/contract/ISchool";
import { FirebaseModel } from "./FirebaseModel";

class School extends FirebaseModel<ISchool> {

    public name: string;

    constructor(dto: ISchool) {
        super(dto);
        this.name = dto.name;
    }

    public getDto(): ISchool {
        return {
            name: this.name,
        };
    }
}

export { School };
