import i18n from 'i18next';
let Localization: any = null;
try {
    Localization = require('react-native-localize');
}
catch (error) {
}
export const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: (callback: (language: string) => void) => {
        try {
            if (Localization) {
                const locales = Localization.getLocales();
                const languageCode = locales[0]?.languageCode || 'en';
                const languageTag = locales[0]?.languageTag || 'en';
                if (i18n.hasResourceBundle(languageTag, 'common')) {
                    callback(languageTag);
                    return;
                }
                else if (i18n.hasResourceBundle(languageCode, 'common')) {
                    callback(languageCode);
                    return;
                }
            }
        }
        catch (error) {
        }
        callback('en');
    },
    init: () => { },
    cacheUserLanguage: () => { },
};
