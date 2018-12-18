import { FirebaseValidator } from "../validators/FirebaseValidator";
import { StringValidator } from "../validators/StringValidator";
import { ValidationResult } from "../validators/ValidationResult";
import { ValidationError } from "../validators/ValidationError";

export interface ISchool {
    id?: string;
    name: string;
}

export function validateSchool(school: ISchool): ValidationResult<ISchool> {
    const result = new ValidationResult<ISchool>(school);

    /**
     * id
     */
    if (FirebaseValidator.hasId(school)) {
        result.add(new ValidationError<ISchool>("id", "validation.model_should_not_have_id"))
    }

    /**
     * name
     */
    if (StringValidator.isEmpty(school.name)) {
        result.add(new ValidationError<ISchool>("name", "validation.field_should_not_be_empty"));
    }

    return result;
}
