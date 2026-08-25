import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';

/* TODO GENERIC CLASSES */
import { UdtCode, UdtName } from '../datatypes/udt';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  identificationCode: { order: 1, attributeName: 'cbc:IdentificationCode', max: 1, classRef: UdtCode },
  name: { order: 2, attributeName: 'cbc:Name', max: 1, classRef: UdtName },
};

type AllowedParams = {
  /** A code signifying this country. */
  identificationCode?: string | UdtCode;
  /** The name of this country */
  name?: string | UdtName;
};

/**
 * A class to describe a country.
 */
class CountryType extends GenericAggregateComponent {
  /**
   * @param {AllowedParams} content
   * @param {string} name
   */
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:CountryType');
  }
}

export { CountryType as Country, AllowedParams as CountryParams };
