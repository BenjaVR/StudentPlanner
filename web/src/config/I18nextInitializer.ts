import i18next from "i18next";
import { reactI18nextModule } from "react-i18next";
import { En } from "shared/dist/translations/En";
import { Nl } from "shared/dist/translations/Nl";
import { Language } from "shared/dist/translations/types";

export class I18nextInitializer {
    public static initialize(lang: Language): void {
        i18next
            .use(reactI18nextModule)
            .init({
                lng: lang,
                fallbackLng: "en",
                keySeparator: false, // dots in translations do not mean nested json in our case.
                resources: {
                    en: {
                        translation: new En().getTranslations(),
                    },
                    nl: {
                        translation: new Nl().getTranslations(),
                    },
                },
            });
    }
}
