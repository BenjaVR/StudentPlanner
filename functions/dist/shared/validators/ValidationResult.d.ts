import { ValidationError } from "./ValidationError";
export declare class ValidationResult<T> {
    readonly instance: T;
    readonly errors: Array<ValidationError<T>>;
    constructor(instance: T);
    add(error: ValidationError<T>): void;
    hasErrors(): boolean;
    getErrorsWithField(field: keyof T): Array<ValidationError<T>>;
}
