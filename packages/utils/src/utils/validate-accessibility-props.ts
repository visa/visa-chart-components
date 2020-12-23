/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { string as yupString, addMethod, ref, object as yupObject, array, bool as yupBool } from 'yup';

const validationStyle = {
  warningStyle: 'color: #C6003F;font-size:medium;',
  recommendationStyle: 'font-size:medium;',
  specialRecommendationStyle: 'color: #0061C1;font-size:medium;'
};

const VALIDATIONRULES = {
  TITLE: {
    MIN: 5,
    MAX: 50
  },
  PURPOSE: {
    MIN: 40,
    MAX: 250
  },
  EXECUTIVE: {
    MIN: 40,
    MAX: 250
  },
  EXECUTIVECOMBINED: {
    MIN: 40,
    MAX: 250
  },
  CONTEXTEXPLANATION: {
    MIN: 40,
    MAX: 500
  },
  CONTEXTEXPLANATIONCOMBINED: {
    MIN: 40,
    MAX: 500
  },
  STATISTICALNOTES: {
    MIN: 40,
    MAX: 250
  },
  STRUCTURENOTES: {
    MIN: 40,
    MAX: 250
  },
  DATAELEMENTDESCRIPTIONACCESSOR: {
    MIN: 0,
    MAX: 125
  },
  ELEMENTDESCRIPTIONACCESSOR: {
    MAX: 125
  },
  ANNOTATIONNOTETITLE: {
    MIN: 5,
    MAX: 50
  },
  ANNOTATIONNOTELABEL: {
    MIN: 25,
    MAX: 125
  },
  ANNOTATIONACCESSIBILITYDESCRIPTION: {
    MIN: 25,
    MAX: 125
  },
  UNIQUEID: {
    MIN: 1,
    MAX: 125
  }
};

const VALIDATIONMESSAGES = {
  WARNINGS: {
    TITLE: 'Either mainTitle or accessibility.title is required',
    LONGDESCRIPTION: 'Either accessibility.longDescription or accessibility.contextExplanation is required',
    EXECUTIVESUMMARY: 'Either accessibility.purpose or accessibility.executiveSummary is required',
    ONCLICKFUNC: 'accessibility.elementsAreInterface needs a boolean value either true or false',
    ANNOTATIONDESCRIPTION: 'Either annotation.accessibilityDescription or annotation.note.label is required',
    WARNINGLOGGROUP: 'CHARTNAME has accessibility warnings and other messages',
    NORMALIZED: 'Either tooltipLabel or dataLabel should have normalized format'
  },
  RECOMMENDATIONS: {
    EXECUTIVESUMMARY:
      'Either accessibility.purpose or accessibility.executiveSummary should have minimum 40 characters and a combined length between 40 and 250 characters',
    LONGDESCRIPTION:
      'Either accessibility.longDescription or accessibility.contextExplanation should have minimum 40 characters and a combined length between 40 and 500 characters',
    TITLE: 'Either mainTitle or accessibility.title should have length between 5 and 50 characters',
    STATISTICALNOTES: 'accessibility.statisticalNotes should have length between 40 and 250 characters',
    STRUCTURENOTES: 'accessibility.structureNotes should have length between 40 and 250 characters',
    DATAELEMENTDESCRIPTIONACCESSOR:
      'accessibility.elementDescriptionAccessor should have length between 0 and 125 characters',
    ELEMENTDESCRIPTIONACCESSOR:
      'Passing accessibility.elementDescriptionAccessor can add description to chart elements',
    ANNOTATIONNOTETITLE: 'Should have length between 5 and 50 characters',
    ANNOTATIONNOTELABEL: 'Should have length between 25 and 125 characters',
    ANNOTATIONACCESSIBILITYDESCRIPTION: 'Should have length between 25 and 125 characters',
    UNIQUEID: 'Should have human readable uniqueID',
    INCLUDEDATAKEYNAMES:
      "accessibility.includeDataKeyNames: data's key names are recommended as human-readable with includeDataKeyNames set to true",
    RECOMMENDATIONLOGGROUP: 'CHARTNAME has strong accessibility recommendations',
    SPECIALRECOMMENDATION:
      'Success! CHARTNAME has met minimum accessibility, we recommend you disable accessibility validation by setting accessibility.disableValidation'
  }
};

const ACCESSIBILITYPROPS = {
  MAINTITLE: 'mainTitle',
  LONGDESCRIPTION: 'longDescription',
  CONTEXTEXPLANATION: 'contextExplanation',
  PURPOSE: 'purpose',
  ONCLICKFUNC: 'onClickFunc',
  NOTE: 'note',
  DISABLEVALIDATION: 'disableValidation',
  INCLUDEDATAKEYNAMES: 'includeDataKeyNames',
  CHARTNAME: 'CHARTNAME',
  TOOLTIPLABEL: 'tooltipLabel',
  DATALABEL: 'dataLabel',
  VALUEACCESSOR: 'valueAccessor'
};

const options = {
  abortEarly: false
};

const accessibilityWarningsSubSchema = {
  requiredSchema: yupString()
    .required()
    .trim(),
  requiredSubSchema: yupObject().shape({
    label: yupString()
      .required()
      .trim()
  }),
  requiredBooleanSchema: yupBool().required()
};

const getCustomSchema = function(min: number, max: number) {
  return yupString()
    .required()
    .trim()
    .min(min)
    .max(max);
};

const getCustomRegexSchema = function(regexWord) {
  return yupString()
    .required()
    .trim()
    .matches(regexWord);
};

const validateBySchemaRefs = function(
  validationMessage: string,
  tooltipLabelRef,
  dataLabelRef,
  valueAccessorRef,
  schema
) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      const tooltipLabelValue = this.resolve(tooltipLabelRef);
      const dataLabelValue = this.resolve(dataLabelRef);
      const valueAccessorValue = this.resolve(valueAccessorRef);

      if (
        value &&
        yupString()
          .min(1)
          .isValidSync(valueAccessorValue, options)
      ) {
        let valueAccessorIndex = Array.prototype.findIndex.call(
          tooltipLabelValue.labelAccessor,
          el => el.trim() === ('' + valueAccessorValue).trim()
        );
        return valueAccessorIndex > -1
          ? schema.isValidSync(((tooltipLabelValue || {}).format || [''])[valueAccessorIndex], options)
          : schema.isValidSync((dataLabelValue || {}).format, options);
      }
      return true;
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

const validateBySchemaRefBoolean = function(schema, booleanSchema, ref, validationMessage: string) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      const refField = this.resolve(ref);
      return schema.isValidSync(refField, options)
        ? booleanSchema.isValidSync(value, { abortyEarly: false, strict: true })
        : true;
    }
  });
};

const validateBySchemaRefAndCondition = function(schema, combinedSchema, ref, validationMessage: string) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      const refField = (this.resolve(ref) || '').toString().trim();
      const field = (value || '').toString().trim();
      const fieldRefFieldCombined = `${refField}${field}`;
      const isValidRefField = schema.isValidSync(refField, options);
      const isValidField = schema.isValidSync(field, options);
      const isValid = combinedSchema.isValidSync(fieldRefFieldCombined, options);
      const derivedValidStatus =
        (refField.length && !isValidRefField) || (field.length && !isValidField) ? false : true;
      return derivedValidStatus && (isValidField || isValidRefField) && isValid ? true : false;
    }
  });
};

const validateBySchema = function(schema, validationMessage: string) {
  return this.test({
    message: validationMessage,
    test: function(value) {
      return schema.isValidSync(value, options);
    }
  });
};

const getAccessibilityWarningsSchema = function() {
  return yupObject().shape({
    title: (yupString() as any).validateBySchemaRef(
      VALIDATIONMESSAGES.WARNINGS.TITLE,
      ref(`\$${ACCESSIBILITYPROPS.MAINTITLE}`),
      accessibilityWarningsSubSchema.requiredSchema
    ),

    longDescription: (yupString() as any).validateBySchemaRef(
      VALIDATIONMESSAGES.WARNINGS.LONGDESCRIPTION,
      ref(`${ACCESSIBILITYPROPS.CONTEXTEXPLANATION}`),
      accessibilityWarningsSubSchema.requiredSchema
    ),

    executiveSummary: (yupString() as any).validateBySchemaRef(
      VALIDATIONMESSAGES.WARNINGS.EXECUTIVESUMMARY,
      ref(`${ACCESSIBILITYPROPS.PURPOSE}`),
      accessibilityWarningsSubSchema.requiredSchema
    ),

    elementsAreInterface: (yupBool() as any).validateBySchemaRefBoolean(
      accessibilityWarningsSubSchema.requiredSchema,
      accessibilityWarningsSubSchema.requiredBooleanSchema,
      ref(`\$${ACCESSIBILITYPROPS.ONCLICKFUNC}`),
      VALIDATIONMESSAGES.WARNINGS.ONCLICKFUNC
    ),

    normalized: (yupBool() as any).validateBySchemaRefs(
      VALIDATIONMESSAGES.WARNINGS.NORMALIZED,
      ref(`\$${ACCESSIBILITYPROPS.TOOLTIPLABEL}`),
      ref(`\$${ACCESSIBILITYPROPS.DATALABEL}`),
      ref(`\$${ACCESSIBILITYPROPS.VALUEACCESSOR}`),
      getCustomRegexSchema(/^normalized$/)
    ),

    annotations: array().of(
      yupObject().shape({
        accessibilityDescription: (yupString() as any).validateBySchemaRef(
          VALIDATIONMESSAGES.WARNINGS.ANNOTATIONDESCRIPTION,
          ref(`${ACCESSIBILITYPROPS.NOTE}`),
          accessibilityWarningsSubSchema.requiredSchema,
          accessibilityWarningsSubSchema.requiredSubSchema
        )
      })
    )
  });
};

const getAccessibilityRecommendationSchema = function() {
  return yupObject().shape({
    title: (yupString() as any).validateBySchemaRef(
      VALIDATIONMESSAGES.RECOMMENDATIONS.TITLE,
      ref(`\$${ACCESSIBILITYPROPS.MAINTITLE}`),
      getCustomSchema(VALIDATIONRULES.TITLE.MIN, VALIDATIONRULES.TITLE.MAX)
    ),

    longDescription: (yupString() as any).validateBySchemaRefAndCondition(
      getCustomSchema(VALIDATIONRULES.CONTEXTEXPLANATION.MIN, VALIDATIONRULES.CONTEXTEXPLANATION.MAX),
      getCustomSchema(VALIDATIONRULES.CONTEXTEXPLANATIONCOMBINED.MIN, VALIDATIONRULES.CONTEXTEXPLANATIONCOMBINED.MAX),
      ref(`${ACCESSIBILITYPROPS.CONTEXTEXPLANATION}`),
      VALIDATIONMESSAGES.RECOMMENDATIONS.LONGDESCRIPTION
    ),

    executiveSummary: (yupString() as any).validateBySchemaRefAndCondition(
      getCustomSchema(VALIDATIONRULES.PURPOSE.MIN, VALIDATIONRULES.PURPOSE.MAX),
      getCustomSchema(VALIDATIONRULES.EXECUTIVECOMBINED.MIN, VALIDATIONRULES.EXECUTIVECOMBINED.MAX),
      ref(`${ACCESSIBILITYPROPS.PURPOSE}`),
      VALIDATIONMESSAGES.RECOMMENDATIONS.EXECUTIVESUMMARY
    ),

    statisticalNotes: (yupString() as any).validateBySchema(
      getCustomSchema(VALIDATIONRULES.STATISTICALNOTES.MIN, VALIDATIONRULES.STATISTICALNOTES.MAX),
      VALIDATIONMESSAGES.RECOMMENDATIONS.STATISTICALNOTES
    ),

    structureNotes: (yupString() as any).validateBySchema(
      getCustomSchema(VALIDATIONRULES.STRUCTURENOTES.MIN, VALIDATIONRULES.STRUCTURENOTES.MAX),
      VALIDATIONMESSAGES.RECOMMENDATIONS.STRUCTURENOTES
    ),

    elementDescriptionAccessor: (yupString().nullable() as any).validateBySchema(
      yupString()
        .nullable()
        .max(VALIDATIONRULES.ELEMENTDESCRIPTIONACCESSOR.MAX),
      VALIDATIONMESSAGES.RECOMMENDATIONS.ELEMENTDESCRIPTIONACCESSOR
    ),

    annotations: array().of(
      yupObject().shape({
        note: yupObject().shape({
          title: (yupString() as any).validateBySchema(
            getCustomSchema(VALIDATIONRULES.ANNOTATIONNOTETITLE.MIN, VALIDATIONRULES.ANNOTATIONNOTETITLE.MAX),
            VALIDATIONMESSAGES.RECOMMENDATIONS.ANNOTATIONNOTETITLE
          ),
          label: (yupString() as any).validateBySchema(
            getCustomSchema(VALIDATIONRULES.ANNOTATIONNOTELABEL.MIN, VALIDATIONRULES.ANNOTATIONNOTELABEL.MAX),
            VALIDATIONMESSAGES.RECOMMENDATIONS.ANNOTATIONNOTELABEL
          )
        }),
        accessibilityDescription: (yupString() as any).validateBySchema(
          getCustomSchema(
            VALIDATIONRULES.ANNOTATIONACCESSIBILITYDESCRIPTION.MIN,
            VALIDATIONRULES.ANNOTATIONACCESSIBILITYDESCRIPTION.MAX
          ),
          VALIDATIONMESSAGES.RECOMMENDATIONS.ANNOTATIONACCESSIBILITYDESCRIPTION
        )
      })
    ),

    data: array()
      .nullable()
      .of(
        yupObject().shape({
          note: (yupString().nullable() as any).validateBySchema(
            yupString()
              .nullable()
              .max(VALIDATIONRULES.DATAELEMENTDESCRIPTIONACCESSOR.MAX),
            VALIDATIONMESSAGES.RECOMMENDATIONS.DATAELEMENTDESCRIPTIONACCESSOR
          )
        })
      ),

    uniqueID: (yupString() as any).validateBySchema(
      yupString()
        .required()
        .trim()
        .min(VALIDATIONRULES.UNIQUEID.MIN),
      VALIDATIONMESSAGES.RECOMMENDATIONS.UNIQUEID
    )
  });
};

function validateRecommendations(chartName, accessibilityProps, optionsWithContext, isAnyWarnings) {
  const recommendationSpecialMessage = VALIDATIONMESSAGES.RECOMMENDATIONS.SPECIALRECOMMENDATION.replace(
    ACCESSIBILITYPROPS.CHARTNAME,
    chartName
  );
  const recommendationGroup = VALIDATIONMESSAGES.RECOMMENDATIONS.RECOMMENDATIONLOGGROUP.replace(
    ACCESSIBILITYPROPS.CHARTNAME,
    chartName
  );

  try {
    const accessibilityRecommendationSchema = getAccessibilityRecommendationSchema();
    accessibilityRecommendationSchema.validateSync(accessibilityProps, optionsWithContext);
    if (!isAnyWarnings && accessibilityProps && !accessibilityProps[ACCESSIBILITYPROPS.DISABLEVALIDATION]) {
      console.log(`%c ${recommendationSpecialMessage}`, validationStyle.specialRecommendationStyle);
    }
  } catch (errors) {
    let allErrors = {};
    if (!isAnyWarnings) {
      console.groupCollapsed(`%c ${recommendationGroup}`, validationStyle.recommendationStyle);
    }
    errors.inner.map(error => {
      allErrors[error.path] = error.message;
      console.log(`%c ${error.path}: ${error.message}`, validationStyle.recommendationStyle);
    });
  }

  if (!accessibilityProps && !accessibilityProps[ACCESSIBILITYPROPS.INCLUDEDATAKEYNAMES]) {
    console.log(`%c ${VALIDATIONMESSAGES.RECOMMENDATIONS.INCLUDEDATAKEYNAMES}`, validationStyle.recommendationStyle);
  }
  console.groupEnd();
}

function validateWarnings(chartName, accessibilityProps, optionsWithContext) {
  const warningGroup = VALIDATIONMESSAGES.WARNINGS.WARNINGLOGGROUP.replace(ACCESSIBILITYPROPS.CHARTNAME, chartName);
  try {
    const accessibilityWarningSchema = getAccessibilityWarningsSchema();
    accessibilityWarningSchema.validateSync(accessibilityProps, optionsWithContext);
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

export interface IOtherProps {
  context?: object;
  data?: object;
  uniqueID?: string;
  annotations?: object;
  misc?: object;
}
const validateAccessibilityProps = function(
  chartName: string,
  accessibilityObject: object = {},
  otherProps: IOtherProps = { context: {}, data: {}, uniqueID: '', annotations: [], misc: {} }
) {
  const { context, annotations, data, uniqueID, misc } = otherProps;
  const optionsWithContext = {
    context,
    abortEarly: false
  };
  const accessibilityProps = { ...accessibilityObject, annotations, data, uniqueID, ...misc };

  addMethod(yupString, 'validateBySchemaRefAndCondition', validateBySchemaRefAndCondition);
  addMethod(yupString, 'validateBySchema', validateBySchema);
  addMethod(yupBool, 'validateBySchemaRefs', validateBySchemaRefs);
  addMethod(yupString, 'validateBySchemaRef', validateBySchemaRef);
  addMethod(yupBool, 'validateBySchemaRefBoolean', validateBySchemaRefBoolean);

  const isAnyWarnings = validateWarnings(chartName, accessibilityProps, optionsWithContext);
  validateRecommendations(chartName, accessibilityProps, optionsWithContext, isAnyWarnings);
};

export { validateAccessibilityProps };
