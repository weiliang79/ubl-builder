// 'use strict'

import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from './GenericAggregateComponent';
import { UdtIdentifier, UdtName, UdtCode, UdtText, UdtMeasure } from '../types/UnqualifiedDataTypes';
import { UdtPercent } from '../types/UnqualifiedDataTypes/UdtPercent';
import { UdtAmount } from '../types/UnqualifiedDataTypes/UdtAmount';
import { TaxScheme } from './TaxScheme';
import { TaxCategoryType } from './TaxCategoryType';

/*

  1  cbc:ID [0..1]    An identifier for this tax category.
  2  cbc:Name [0..1]    The name of this tax category.
  3  cbc:Percent [0..1]    The tax rate for this category, expressed as a percentage.
  4  cbc:BaseUnitMeasure [0..1]    A Unit of Measures used as the basic for the tax calculation applied at a certain rate per unit.
  5  cbc:PerUnitAmount [0..1]    Where a tax is applied at a certain rate per unit, the rate per unit applied.
  6  cbc:TaxExemptionReasonCode [0..1]    The reason for tax being exempted, expressed as a code.
  7  cbc:TaxExemptionReason [0..*]    The reason for tax being exempted, expressed as text.
  8  cbc:TierRange [0..1]    Where a tax is tiered, the range of taxable amounts that determines the rate of tax applicable to this tax category.
  9  cbc:TierRatePercent [0..1]    Where a tax is tiered, the tax rate that applies within the specified range of taxable amounts for this tax category.
  10  cac:TaxScheme [1..1]    The taxation scheme within which this tax category is defined.

*/

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  id: { order: 1, attributeName: 'cbc:ID', min: 0, max: 1, classRef: UdtIdentifier },
  name: { order: 2, attributeName: 'cbc:Name', min: 0, max: 1, classRef: UdtName },
  percent: { order: 3, attributeName: 'cbc:Percent', min: 0, max: 1, classRef: UdtPercent },
  baseUnitMeasure: { order: 4, attributeName: 'cbc:BaseUnitMeasure', min: 0, max: 1, classRef: UdtMeasure },
  perUnitAmount: { order: 5, attributeName: 'cbc:PerUnitAmount', min: 0, max: 1, classRef: UdtAmount },
  taxExemptionReasonCode: { order: 6, attributeName: 'cbc:TaxExemptionReasonCode', min: 0, max: 1, classRef: UdtCode },
  taxExemptionReason: { order: 7, attributeName: 'cbc:TaxExemptionReason', min: 0, max: undefined, classRef: UdtText },
  tierRange: { order: 8, attributeName: 'cbc:TierRange', min: 0, max: 1, classRef: UdtText },
  tierRatePercent: { order: 9, attributeName: 'cbc:TierRatePercent', min: 0, max: 1, classRef: UdtPercent },
  taxScheme: { order: 10, attributeName: 'cac:TaxScheme', min: 0, max: 1, classRef: TaxScheme },
};

type AllowedParams = {
  id?: string | UdtIdentifier;
  name?: string | UdtName;
  percent?: string | UdtPercent;
  baseUnitMeasure?: string | UdtMeasure;
  perUnitAmount?: string | UdtAmount;
  taxExemptionReasonCode?: string | UdtCode;
  taxExemptionReason?: string | UdtText;
  tierRange?: string | UdtText;
  tierRatePercent?: string | UdtPercent;
  taxScheme?: TaxScheme;
};

/**
 *
 */

class ClassifiedTaxCategoryType extends GenericAggregateComponent {
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:ClassifiedTaxCategory');
  }

  setPercent(value: string | UdtPercent) {
    this.attributes.percent = value instanceof UdtPercent ? value : new UdtPercent(value);
  }

  /**
   * @returns { string | UdtPercent }
   */
  getPercent(rawValue = true) {
    return rawValue ? this.attributes.percent.content : this.attributes.percent;
  }

  getTaxScheme(): TaxScheme {
    return this.attributes.taxScheme;
  }
}

export {
  TaxCategoryType as TaxCategory,
  AllowedParams as TaxCategoryTypeParams,
  ClassifiedTaxCategoryType as ClassifiedTaxCategory,
  AllowedParams as ClassifiedTaxCategoryTypeParams,
  ParamsMap as TaxCategoryTypeParamsMap,
};
