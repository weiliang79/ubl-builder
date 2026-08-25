import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtIdentifier } from '../datatypes/udt';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  id: { order: 1, attributeName: 'cbc:ID', max: 1, classRef: UdtIdentifier },
};

type AllowedParams = {
  /** An identifier for the party */
  id: string | UdtIdentifier;
};

class PartyIdentification extends GenericAggregateComponent {
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:PartyIdentification');
  }
}

export { PartyIdentification, AllowedParams as PartyIdentificationParams };
