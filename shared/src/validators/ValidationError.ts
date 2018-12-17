import { ITranslations } from "../translations/types";

export class ValidationError<T> {

    public readonly field: keyof T;
    /**
     * Translation key that contains the error message.
     */
    public readonly translationKey: keyof ITranslations;

    constructor(field: keyof T, translationKey: keyof ITranslations) {
        this.field = field;
        this.translationKey = translationKey;
    }
}
