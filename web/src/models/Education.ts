import { IEducation } from "../entities/IEducation";
import { ModelBase } from "./ModelBase";

export class Education extends ModelBase<IEducation> {

    constructor(
        public name: string,
    ) {
        super();
    }

    public static fromEntity(entity: IEducation): Education {
        const education = new Education(
            entity.name,
        );
        education.fillBaseFields(entity);
        return education;
    }

    protected getEntityInternal(): IEducation {
        return {
            name: this.name,
        };
    }
}
