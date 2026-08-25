import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtIdentifier } from '../datatypes/udt';
import { FinancialInstitutionBranch } from './FinancialInstitutionBranch';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  id: { order: 1, attributeName: 'cbc:ID', min: 0, max: 1, classRef: UdtIdentifier },
  financialInstitutioBranch: {
    order: 2,
    attributeName: 'cac:FinancialInstitutionBranch',
    min: 0,
    max: 1,
    classRef: FinancialInstitutionBranch,
  },
};

type AllowedParams = {
  id: string | UdtIdentifier;
  financialInstitutioBranch?: FinancialInstitutionBranch;
};

class PayeeFinancialAccount extends GenericAggregateComponent {
  /**
   *
   * @param content
   */
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:PayeeFinancialAccount');
  }
}

export { PayeeFinancialAccount, AllowedParams as PayeeFinancialAccountParams };
