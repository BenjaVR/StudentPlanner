import { ValidationResult } from "../validators/ValidationResult";
export interface ILoginDetails {
    username: string;
    password: string;
}
export declare function validateLoginDetails(loginDetails: ILoginDetails): ValidationResult<ILoginDetails>;
