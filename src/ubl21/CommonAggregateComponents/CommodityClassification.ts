import { UdtCode } from '../types/UnqualifiedDataTypes';
import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from './GenericAggregateComponent';

/*
    cbc:ItemClassificationCode [1..1]  A code signifying the classification of the item
*/
const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  itemClassificationCode: {
    order: 1,
    attributeName: 'cbc:ItemClassificationCode',
    min: 1,
    max: 1,
    classRef: UdtCode,
  },
};

type AllowedParams = {
  itemClassificationCode: string | UdtCode;
};

class CommodityClassification extends GenericAggregateComponent {
  /**
   * @param {AllowedParams} content
   */
  constructor(content?: AllowedParams) {
    super(content, ParamsMap, 'cac:CommodityClassification');
  }
}

export { CommodityClassification, AllowedParams as CommodityClassificationParams };
