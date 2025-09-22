import { UdtAmount } from '../types/UnqualifiedDataTypes';
import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from './GenericAggregateComponent';

/*
    cbc:Amount [1..1]  The amount of the item price.
*/
const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  amount: { order: 1, attributeName: 'cbc:Amount', min: 1, max: 1, classRef: UdtAmount },
};

interface AllowedParams {
  amount: UdtAmount | string;
}

class ItemPriceExtension extends GenericAggregateComponent {
  /**
   * @param {AllowedParams} content
   */
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:ItemPriceExtension');
  }
}

export { ItemPriceExtension, AllowedParams as ItemPriceExtensionParams };
