import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtCode, UdtIdentifier, UdtName, UdtText } from '../datatypes/udt';
import { Country } from './Country';
import { FinancialInstitutionBranch } from './FinancialInstitutionBranch';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  name: { order: 2, attributeName: 'cbc:Name', min: 0, max: 1, classRef: UdtName },
  aliasName: { order: 3, attributeName: 'cbc:AliasName', min: 0, max: 1, classRef: UdtName },
  accountTypeCode: { order: 4, attributeName: 'cbc:AccountTypeCode', min: 0, max: 1, classRef: UdtCode },
  accountFormatCode: { order: 5, attributeName: 'cbc:AccountFormatCode', min: 0, max: 1, classRef: UdtCode },
  currencyCode: { order: 6, attributeName: 'cbc:CurrencyCode', min: 0, max: 1, classRef: UdtCode },
  paymentNotes: { order: 7, attributeName: 'cbc:PaymentNote', min: 0, max: undefined, classRef: UdtText },
  country: { order: 9, attributeName: 'cac:Country', min: 0, max: 1, classRef: () => Country },
  id: { order: 1, attributeName: 'cbc:ID', min: 0, max: 1, classRef: UdtIdentifier },
  financialInstitutioBranch: {
    order: 2,
    attributeName: 'cac:FinancialInstitutionBranch',
    min: 0,
    max: 1,
    classRef: () => FinancialInstitutionBranch,
  },
};

type AllowedParams = {
  /** The name of this financial account. */
  name?: string | UdtName;
  /** An alias for the name of this financial account, to be used in place of the actual account name for security reasons. */
  aliasName?: string | UdtName;
  /** A code signifying the type of this financial account. */
  accountTypeCode?: string | UdtCode;
  /** A code signifying the format of this financial account. */
  accountFormatCode?: string | UdtCode;
  /** A code signifying the currency in which this financial account is held. */
  currencyCode?: string | UdtCode;
  /** Free-form text applying to the Payment for the owner of this account. */
  paymentNotes?: string | UdtText[];
  /** The country in which the holder of the financial account is domiciled. */
  country?: Country;
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
