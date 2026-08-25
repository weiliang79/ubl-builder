import { TaxScheme } from '../../cac';
import { UdtIdentifier } from '../../datatypes/udt';

/**
 * The fixed vocabulary MyInvois documents repeat.
 *
 * Verified against the LHDN SDK code lists on 2026-08-25.
 */

/** Tax type codes. */
export const TaxCategoryCode = {
  SalesTax: '01',
  ServiceTax: '02',
  TourismTax: '03',
  HighValueGoodsTax: '04',
  SalesTaxOnLowValueGoods: '05',
  NotApplicable: '06',
  Exempt: 'E',
} as const;

/** e-Invoice type codes, carried in cbc:InvoiceTypeCode. */
export const DocumentTypeCode = {
  Invoice: '01',
  CreditNote: '02',
  DebitNote: '03',
  RefundNote: '04',
  SelfBilledInvoice: '11',
  SelfBilledCreditNote: '12',
  SelfBilledDebitNote: '13',
  SelfBilledRefundNote: '14',
} as const;

/**
 * Document structure version, carried as `cbc:InvoiceTypeCode/@listVersionID`.
 *
 * The two differ only in that v1.1 enables signature validation; the data
 * structure is identical. LHDN has said v1.0 will be retired but has not
 * announced a date.
 */
export const DocumentVersion = {
  Unsigned: '1.0',
  Signed: '1.1',
} as const;

/** Attributes for cbc:IdentificationCode inside cac:Country. */
export const COUNTRY_CODE_ATTRIBUTES = { listID: 'ISO3166-1', listAgencyID: '6' } as const;

/** Attributes for cbc:ItemClassificationCode. */
export const CLASSIFICATION_ATTRIBUTES = { listID: 'CLASS' } as const;

/** Identification schemes used on cac:PartyIdentification. */
export const IdentificationScheme = {
  Tin: 'TIN',
  BusinessRegistration: 'BRN',
  Nric: 'NRIC',
  Passport: 'PASSPORT',
  Army: 'ARMY',
  SalesTax: 'SST',
  TourismTax: 'TTX',
} as const;

/**
 * The tax scheme every MyInvois subtotal carries.
 *
 * A factory rather than a shared constant: one instance reused across a
 * document tree would be a single mutable node in several places.
 */
export const otherTaxScheme = (): TaxScheme =>
  new TaxScheme({
    id: new UdtIdentifier('OTH', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }),
  });
