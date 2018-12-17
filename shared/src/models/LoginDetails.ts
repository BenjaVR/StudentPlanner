import { ValidationResult } from "../validators/ValidationResult";
import { StringValidator } from "../validators";
import { ValidationError } from "../validators/ValidationError";

export interface ILoginDetails {
    username: string;
    password: string;
}

export function validateLoginDetails(loginDetails: ILoginDetails): ValidationResult<ILoginDetails> {
    const result = new ValidationResult<ILoginDetails>(loginDetails);

    /**
     * username
     */
    if (StringValidator.isEmpty(loginDetails.username)) {
        result.add(new ValidationError<ILoginDetails>("username", "validation.field_should_not_be_empty"))
    }

    /**
     * password
     */
    if (StringValidator.isEmpty(loginDetails.password)) {
        result.add(new ValidationError<ILoginDetails>("password", "validation.field_should_not_be_empty"))
    }

    return result;
}
