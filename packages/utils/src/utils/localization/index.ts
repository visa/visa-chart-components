/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { isObject, isUndefined, isEmpty } from '../utilFunctions';
import { en } from './languages/en';
import { setNumeralLocale, registerNumeralLocale } from '../formatStats';
import { getGlobalInstances } from '../globalInstances';

// import {
//   valMissingLanguage,
//   valMissingNumeralLocale,
// } from './validate-localization-props';

export const defaultI18NextNamespace = 'vcc';

export function getActiveLanguageString(localization) {
  // if we get here and don't have i18Next, we need to initialize it
  const i18Instance = getGlobalInstances()['i18Next'];
  // we return language in this order, this allows us to use a specific language for each chart
  // and default back to the globally set language if one is not provided
  // 1. if we have locale use it
  // 2. if we have language string or object then use that
  // 3. if we have neither of those use the i18Next.resolvedLanguage/currentLanguage
  const languageString =
    localization && localization.language
      ? typeof localization.language === 'object'
        ? // tslint:disable-next-line: no-string-literal
          localization.language[defaultI18NextNamespace].attr.language
        : localization.language
      : i18Instance.resolvedLanguage;
  return languageString;
}

export function configLocalization(localization) {
  // if we have received objects, register them (if appropriate)
  // we can check for registration of objects passed in language / numeralLocale
  if (isObject(localization.language)) {
    registerI18NextLanguage(localization.language, localization.overwrite);
  }

  // we need to check for validity of this object, or this could error
  if (isObject(localization.numeralLocale)) {
    registerNumeralLocale(
      localization.numeralLocale.attr.numeralLocale,
      localization.numeralLocale,
      localization.overwrite
    );
  }

  // at this point if we were passed an object it has been registered and we can just
  // go forward with strings to set against the loaded/passed strings/objects
  // next we set language and locale values
  const innerLanguage = isObject(localization.language)
    ? localization.language[defaultI18NextNamespace].attr.language
    : localization.language;
  const innerNumeralLocale = isObject(localization.numeralLocale)
    ? localization.numeralLocale.attr.numeralLocale
    : localization.numeralLocale;

  // patching with .toLowerCase() for now, not sure if this could be an issue though
  // we should only set this if they exist and are a string
  if (innerLanguage && typeof innerLanguage === 'string') changeI18NextLanguage(innerLanguage.toLowerCase());
  if (innerNumeralLocale && typeof innerNumeralLocale === 'string') setNumeralLocale(innerNumeralLocale.toLowerCase());
}

export const registerI18NextLanguage = (language, overwrite?: boolean) => {
  // we should start by running validation functions on the object

  // if we get here and don't have i18Next, we need to initialize it
  const i18Instance = getGlobalInstances()['i18Next'];

  const languageString = language[defaultI18NextNamespace].attr.language;

  // at some point we could use this check to validate if we are overwriting existing content
  if (i18Instance.hasResourceBundle(languageString, defaultI18NextNamespace) && !overwrite) {
  } else {
    // now we can add the resource bundle
    i18Instance.addResourceBundle(languageString, defaultI18NextNamespace, {
      ...language[defaultI18NextNamespace]
    });
  }

  // console.log('registering i18Next Language --------->', i18Instance, languageString, overwrite);
};

export const changeI18NextLanguage = (languageString: string) => {
  const i18Instance = getGlobalInstances()['i18Next'];

  if (!i18Instance.hasResourceBundle(languageString, defaultI18NextNamespace)) {
    // valMissingLanguage(languageString);
  } else {
    // we are changing language, i18next
    i18Instance.changeLanguage(languageString, (err, t) => {
      if (err) return console.log(`changing of language to ${languageString} failed`, err);
      t('key'); // -> same as i18next.t
    });
  }
};

// relevant expression based on the given
// path provided as translationKey
function explore(o, s) {
  return s.split('.').reduce(function(r, ss) {
    return r && r[ss] ? r[ss] : null;
  }, o);
}

// This function is responsible to actually translate
// a given expression to the select language
export function translate(translationKey, language) {
  const i18Instance = getGlobalInstances()['i18Next'];
  let translated = '';
  if (i18Instance.isInitialized) {
    // if i18next is initialized we translate the expression
    translated = i18Instance.t(translationKey, { lng: language });
  } else {
    // if i18next is not initialized we load the default language manually
    translated = explore(en, `${defaultI18NextNamespace}.${translationKey}`);
  }
  return translated;
}
