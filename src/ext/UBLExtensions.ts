import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UBLExtension, UBLExtensionParams } from './UBLExtension';

/*
  1   ext:UBLExtension [0..*] A single extension for private use.
*/

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  UBLExtensions: {
    order: 1,
    attributeName: 'ext:UBLExtension',
    max: undefined,
    classRef: UBLExtension,
  },
};

type AllowedParams = {
  /** @type {} A single extension for private use. */
  UBLExtensions?: UBLExtension;
};

/**
 *
 */
class UBLExtensions extends GenericAggregateComponent {
  /**     *
   * @param {AllowedParams} content
   * @param {string} name
   */
  constructor(content?: AllowedParams, name: string = 'ext:UBLExtensions') {
    super(content, ParamsMap, name);
    this.attributes.UBLExtensions = [];
  }

  /**
   * @returns UBLExtension
   */
  getDianUblExtension() {
    if (this.attributes.UBLExtensions.length > 0) {
      const dianExtension = this.attributes.UBLExtensions[0];
      return dianExtension;
    } else {
      return null;
    }
  }

  addUBLExtension(value: UBLExtension | UBLExtensionParams) {
    const itemToPush = value instanceof UBLExtension ? value : new UBLExtension(value);
    this.attributes.UBLExtensions.push(itemToPush);
  }
}

export { UBLExtensions, AllowedParams as UBLExtensionsParams };
