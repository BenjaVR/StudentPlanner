import { ValidationError } from "./ValidationError";

export class ValidationResult<T> {

    public readonly instance: T;
    public readonly errors: Array<ValidationError<T>> = [];

    constructor(instance: T) {
        this.instance = instance;
    }

    public add(error: ValidationError<T>): void {
        this.errors.push(error);
    }

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public getErrorsWithField(field: keyof T): Array<ValidationError<T>> {
        return this.errors.filter((error) => error.field === field);
    }
}
