/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { isUndefined, omit, isEmpty, xor } from '../utilFunctions';
import { en as langTemplate } from './languages/en';
import { US as numeralLocaleTemplate } from './numeralLocales/us';
import deepKeys from 'deep-keys';
import { string as yupString, addMethod, ref, object as yupObject, array, bool as yupBool } from 'yup';
import { validationStyle } from '../style';
import { defaultI18NextNamespace } from '.';

const VALIDATIONMESSAGES = {
  WARNINGS: {
    OBJECTDIFFERENCE:
      "The used file's keys file is different compared to the keys (and nested keys) of the template file. See below for more details on this error. Difference (references to differences are comma separated and refer to the file you loaded):",
    WARNINGLOGGROUP: 'CHARTNAME has localization warnings and other messages',
    MISSINGLANGUAGE:
      "The language you selected as a string in your chart is not available. You need to register it first, or provide the object of it through the 'localization.language' property. Defaulting back to English language.",
    MISSINGNUMERALLOCALE:
      "The numeralLocale you selected as a string in your chart is not available. You need to register it first, through the global (registerNumeralLocale(<lowerCase string of numeralLocale identifier>, <numeralLocale object>);) or chart-based localization (provide the object of it through the 'localization.numeralLocale' property.) methods. Defaulting back to 'US' numeralLocale.",
    OVERWRITEBOOLEAN: 'localization.overwrite needs a boolean value either true or false',
    OVERWRITE:
      'You are registering a language object that will overwrite an existing language object, if there is any. In case this is the first rendered chart, nothing will be overwritten.'
  },
  RECOMMENDATIONS: {
    RECOMMENDATIONLOGGROUP: 'CHARTNAME has strong localization recommendations',
    PAGELTR: "The page 'dir' of your HTML is 'ltr'. We suggest to use a 'ltr' language.",
    PAGERTL: "The page 'dir' of your HTML is 'rtl'. We suggest to use a 'rtl' language.",
    OVERWRITE:
      'Last loaded localization.language or localization.numeralLocale will overwrite previously loaded identical language and/or numeralLocale object(s) because localization.overwrite boolean is set to true.',
    NOOVERWRITE:
      'Last loaded localization.language or localization.numeralLocale will not overwrite previously loaded identical language and/or numeralLocale object(s) because localization.overwrite boolean is set to false.',
    SPECIALRECOMMENDATION:
      'Success! CHARTNAME has met minimum localization, we recommend you disable localization validation by setting localization.skipValidation'
  }
};

const LOCALIZATIONPROPS = {
  SKIPVALIDATION: 'skipValidation',
  OVERWRITEBOOLEAN: 'overwrite',
  CHARTNAME: 'CHARTNAME',
  LANGUAGE: 'language',
  NUMERALLOCALE: 'numeralLocale',
  LANGUAGEANDNUMERALLOCALE: 'language, numeralLocale',
  NOTE: 'Note'
};

const options = {
  abortEarly: false
};

// This function is validating the direction of your page.
export function valDir() {
  const html = document.querySelector('html');
  if ((html.dir = 'ltr')) {
    // dir = 'lft'
    console.log(`%c ${VALIDATIONMESSAGES.RECOMMENDATIONS.PAGELTR}`, validationStyle.recommendationStyle);
  } else {
    // dir = 'rtl'
    console.log(`%c ${VALIDATIONMESSAGES.RECOMMENDATIONS.PAGERTL}`, validationStyle.recommendationStyle);
  }
}

const validateBySchemaRefBoolean = function(schema, booleanSchema, ref, validationMessage: string) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      const refField = this.resolve(ref);
      return schema.isValidSync(refField, options)
        ? booleanSchema.isValidSync(value, { abortEarly: false, strict: true })
        : true;
    }
  });
};

const validateBySchemaRef = function(validationMessage: string, ref, firstSchema, secondSchema) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      secondSchema = secondSchema ? secondSchema : firstSchema;
      const refField = this.resolve(ref);
      const isFieldValid = firstSchema.isValidSync(value, options);
      const isRefFieldValid = secondSchema.isValidSync(refField, options);
      return isRefFieldValid || isFieldValid ? true : false;
    }
  });
};

const localizationWarningsSubSchema = {
  requiredSchema: yupString()
    .required()
    .trim(),
  requiredSubSchema: yupObject().shape({
    overwrite: yupString()
      .required()
      .trim()
  }),
  requiredBooleanSchema: yupBool().required()
};

const getCustomSchema = function(min: number, max: number) {
  return yupString()
    .required()
    .min(min)
    .max(max);
};

const getLocalizationWarningsSchema = function(languageProps) {
  return yupObject().shape({
    language: (yupObject().nullable() as any).validateBySchemaObject(
      ref(`\$${LOCALIZATIONPROPS.LANGUAGE}`),
      VALIDATIONMESSAGES.WARNINGS.OBJECTDIFFERENCE
    ),
    numeralLocale: (yupObject().nullable() as any).validateBySchemaObject(
      ref(`\$${LOCALIZATIONPROPS.NUMERALLOCALE}`),
      VALIDATIONMESSAGES.WARNINGS.OBJECTDIFFERENCE
    ),
    overwrite: (yupBool() as any).validateBySchemaRefBoolean(
      localizationWarningsSubSchema.requiredSchema,
      localizationWarningsSubSchema.requiredBooleanSchema,
      ref(`\$${LOCALIZATIONPROPS.OVERWRITEBOOLEAN}`),
      VALIDATIONMESSAGES.WARNINGS.OVERWRITEBOOLEAN
    )
  });
};

const getLocalizationRecommendationSchema = function(localizationProps) {
  return yupObject().shape({
    overwrite: (yupString().nullable() as any).validateByOverwriteValue(
      localizationProps,
      ref(`\$${LOCALIZATIONPROPS.OVERWRITEBOOLEAN}`),
      VALIDATIONMESSAGES.RECOMMENDATIONS.OVERWRITE
    )
  });
};

function validateRecommendations(chartName, localizationProps, isAnyWarnings) {
  const recommendationSpecialMessage = VALIDATIONMESSAGES.RECOMMENDATIONS.SPECIALRECOMMENDATION.replace(
    LOCALIZATIONPROPS.CHARTNAME,
    chartName
  );
  const recommendationGroup = VALIDATIONMESSAGES.RECOMMENDATIONS.RECOMMENDATIONLOGGROUP.replace(
    LOCALIZATIONPROPS.CHARTNAME,
    chartName
  );

  try {
    const localizationRecommendationSchema = getLocalizationRecommendationSchema(localizationProps);
    localizationRecommendationSchema.validateSync(localizationProps, options);
    if (!isAnyWarnings && localizationProps && !localizationProps[LOCALIZATIONPROPS.SKIPVALIDATION]) {
      console.log(`%c ${recommendationSpecialMessage}`, validationStyle.specialRecommendationStyle);
    } else {
      // inject other generic recommendations/expressions; not part of validation for now
      valDir();
    }
  } catch (errors) {
    let allErrors = {};

    // inject warnings if any
    if (!isAnyWarnings) {
      console.groupCollapsed(`%c ${recommendationGroup}`, validationStyle.recommendationStyle);
    }
    // mapping thru errors
    errors.inner.map(error => {
      allErrors[error.path] = error.message;
      console.log(`%c ${error.path}: ${error.message}`, validationStyle.recommendationStyle);
    });
  }
  console.groupEnd();
}

function validateWarnings(chartName, localizationProps) {
  const warningGroup = VALIDATIONMESSAGES.WARNINGS.WARNINGLOGGROUP.replace(LOCALIZATIONPROPS.CHARTNAME, chartName);
  try {
    const localizationWarningSchema = getLocalizationWarningsSchema(localizationProps);
    localizationWarningSchema.validateSync(localizationProps, options);
    return false;
  } catch (errors) {
    console.groupCollapsed(`%c ${warningGroup}`, validationStyle.warningStyle);
    let allErrors = {};
    errors.inner.map(error => {
      allErrors[error.path] = error.message;
      console.warn(`%c ${error.path}: ${error.message}`, validationStyle.warningStyle);
    });
    return true;
  }
}

const validateBySchemaObject = function(ref, validationMessage: string) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      const { path, createError } = this;
      if (!isUndefined(value)) {
        const templateFile =
          path === 'language' ? langTemplate[defaultI18NextNamespace] : omit(numeralLocaleTemplate, ['attr']);
        const formattedValue = path === 'language' ? value : omit(value, ['attr']);
        const result = xor(deepKeys(formattedValue), deepKeys(templateFile));
        if (!isEmpty(result)) {
          return createError({ path, message: `${validationMessage} ${result}` });
        }
      }
      return true;
    }
  });
};

const validateByOverwriteValue = function(languageProps, ref, validationMessage: string) {
  return this.test({
    // message: validationMessageTrue,
    test: function(value) {
      const { path, createError } = this;
      if (value == 'true') {
        return createError({ path, message: `${validationMessage}` });
      }
      return true;
    }
  });
};

const validateLocalizationProps = function(chartName: string, localizationObject: object = {}) {
  let localizationProps = { ...localizationObject };

  addMethod(yupString, 'validateBySchemaRef', validateBySchemaRef);
  addMethod(yupBool, 'validateBySchemaRefBoolean', validateBySchemaRefBoolean);
  addMethod(yupObject, 'validateBySchemaObject', validateBySchemaObject);
  addMethod(yupString, 'validateByOverwriteValue', validateByOverwriteValue);

  const warnings = validateWarnings(chartName, localizationProps);
  validateRecommendations(chartName, localizationProps, warnings);
};

export { validateLocalizationProps };
