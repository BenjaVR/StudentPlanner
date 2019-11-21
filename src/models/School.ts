import { ISchool } from "../entities/ISchool";
import { ModelBase } from "./ModelBase";

export class School extends ModelBase<ISchool> {
    constructor(public name: string) {
        super();
    }

    public static fromEntity(entity: ISchool): School {
        const school = new School(entity.name);
        school.fillBaseFields(entity);
        return school;
    }

    protected getEntityInternal(): ISchool {
        return {
            name: this.name,
        };
    }
}
