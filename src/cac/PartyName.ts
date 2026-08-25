import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtName } from '../datatypes/udt';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  name: { order: 1, attributeName: 'cbc:Name', max: 1, classRef: UdtName },
};

type AllowedParams = {
  /** The name of the party */
  name: UdtName | string;
};

class PartyName extends GenericAggregateComponent {
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:PartyName');
  }
}

export { PartyName, AllowedParams as PartyNameParams };
