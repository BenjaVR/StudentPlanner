import { ITranslations } from "../translations/types";
export declare class ValidationError<T> {
    readonly field: keyof T;
    /**
     * Translation key that contains the error message.
     */
    readonly translationKey: keyof ITranslations;
    constructor(field: keyof T, translationKey: keyof ITranslations);
}
