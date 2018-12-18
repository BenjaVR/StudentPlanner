import { ValidationResult } from "../validators/ValidationResult";
export interface ISchool {
    id?: string;
    name: string;
}
export declare function validateSchool(school: ISchool): ValidationResult<ISchool>;
