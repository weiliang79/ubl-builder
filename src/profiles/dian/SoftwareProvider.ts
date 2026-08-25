import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../../core/GenericAggregateComponent';
import { UdtIdentifier } from '../../datatypes/udt';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  providerID: { order: 1, attributeName: 'sts:ProviderID', min: 0, max: 1, classRef: UdtIdentifier },
  softwareID: { order: 2, attributeName: 'sts:SoftwareID', min: 0, max: 1, classRef: UdtIdentifier },
};

type AllowedParams = {
  providerID: string | UdtIdentifier;
  softwareID: string | UdtIdentifier;
};

/**
 * Body of Dian extension content
 */
class SoftwareProvider extends GenericAggregateComponent {
  /**     *
   * @param {AllowedParams} content
   * @param {string} name
   */
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'sts:SoftwareProvider');
  }
}

export { SoftwareProvider, AllowedParams as SoftwareProviderParams };
