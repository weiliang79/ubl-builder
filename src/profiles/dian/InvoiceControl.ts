// 'use strict'

import { PeriodType } from '../../cac';
import GenericAggregateComponent from '../../core/GenericAggregateComponent';
import { UdtText } from '../../datatypes/udt';
import { AuthorizedInvoices } from './AuthorizedInvoices';

const ParamsMap = {
  // ##################################  TODO CAC MISSING ################################################
  invoiceAuthorization: { order: 1, attributeName: 'sts:InvoiceAuthorization', max: 1, classRef: UdtText },
  authorizationPeriod: { order: 2, attributeName: 'sts:AuthorizationPeriod', max: 1, classRef: PeriodType },
  authorizedInvoices: {
    order: 3,
    attributeName: 'sts:AuthorizedInvoices',
    max: 1,
    classRef: AuthorizedInvoices,
  },
};

type AllowedParams = {
  invoiceAuthorization: string | UdtText;
  authorizationPeriod: string | PeriodType;
  authorizedInvoices: AuthorizedInvoices;
};

/**
 * Body of Dian extension content
 */
class InvoiceControl extends GenericAggregateComponent {
  /**     *
   * @param {AllowedParams} content
   * @param {string} name
   */
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'sts:InvoiceControl');
  }
}

export { InvoiceControl, AllowedParams as InvoiceControlParams };
