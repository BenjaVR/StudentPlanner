import { I18nextResourceTranslations, ILanguage } from "./types";

export class Nl implements ILanguage {
    public getTranslations(): I18nextResourceTranslations {
        return {
            "validation.field_should_not_be_empty": "Waarde mag niet leeg zijn.",
            "validation.model_should_not_have_id": "Object mag geen id hebben.",

            "auth.logged_in_successfully": "Succesvol ingelogd!",
            "auth.logging_in_failed": "Inloggen gefaald. Wachtwoord en/of gebruikersnaam zijn incorrect.",
            "auth.logged_out_successfully": "Succesvol uitgelogd!",
            "auth.welcome_back{{username}}": "Welkom terug, {{username}}!",
        };
    }
}
