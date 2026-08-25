import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtIdentifier, UdtName } from '../datatypes/udt';
import { PostalAddress } from './PostalAddress';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  name: { order: 2, attributeName: 'cbc:Name', min: 0, max: 1, classRef: UdtName },
  address: { order: 3, attributeName: 'cac:Address', min: 0, max: 1, classRef: () => PostalAddress },
  id: { order: 1, attributeName: 'cbc:ID', min: 0, max: 1, classRef: UdtIdentifier },
};

type AllowedParams = {
  /** The name of this financial institution. */
  name?: string | UdtName;
  /** The address of this financial institution. */
  address?: PostalAddress;
  id: string | UdtIdentifier;
};

/**
 *
 */
class FinancialInstitution extends GenericAggregateComponent {
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:FinancialInstitution');
  }
}

export { FinancialInstitution, AllowedParams as FinancialInstitutionParams };
