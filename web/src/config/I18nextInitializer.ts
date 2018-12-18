import { En } from "@studentplanner/functions/dist/shared/translations/En";
import { Nl } from "@studentplanner/functions/dist/shared/translations/Nl";
import { Language } from "@studentplanner/functions/dist/shared/translations/types";
import i18next from "i18next";
import { reactI18nextModule } from "react-i18next";

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
