export interface I18nextResource {
    [key: string]: any;
}

export type I18nextResourceTranslations = I18nextResource & ITranslations;

export interface ILanguage {
    getTranslations(): ITranslations;
}

export type Language = "nl" | "en";

export interface ITranslations {
    "validation.field_should_not_be_empty": string;
    "validation.model_should_not_have_id": string;

    "auth.logged_in_successfully": string;
    "auth.logging_in_failed": string;
    "auth.logged_out_successfully": string;
    "auth.welcome_back{{username}}": string;
}
