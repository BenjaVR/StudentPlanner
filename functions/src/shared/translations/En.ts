import { I18nextResourceTranslations, ILanguage } from "./types";

export class En implements ILanguage {
    public getTranslations(): I18nextResourceTranslations {
        return {
            "validation.field_should_not_be_empty": "Value should not be empty.",
            "validation.model_should_not_have_id": "Object should not have an id.",

            "auth.logged_in_successfully": "Succesfully logged in!",
            "auth.logging_in_failed": "Failed to log in. Password and/or username are incorrect.",
            "auth.logged_out_successfully": "Successfully logged out!",
            "auth.welcome_back{{username}}": "Welcome back, {{username}}!",
        };
    }
}
