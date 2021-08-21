import { extend } from './helpers';
const translations = {};


/**
 * Show all translations.
 * @return {object}	The translations.
 */
export const show = (): {} => {
    return translations;
};

/**
 * Add translations to a language.
 * @param {object}  text        Object of key/value translations.
 * @param {string}  language    The translated language.
 */
export const add = (text: object, language: string) => {
    if (typeof translations[language] === 'undefined') {
        translations[language] = {};
    }
    extend(translations[language], text as object);
}

/**
 * Find a translated text in a language.
 * @param   {string} text       The text to find the translation for.
 * @param   {string} language   The language to search in.
 * @return  {string}            The translated text.
 */
export const get = (text: string, language?: string): string => {
    if (
        typeof language === 'string' &&
        typeof translations[language] !== 'undefined'
    ) {
        return translations[language][text] || text;
    }
    return text;
};
