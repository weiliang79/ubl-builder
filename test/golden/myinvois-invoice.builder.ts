import {
  AccountingCustomerParty,
  AccountingSupplierParty,
  AddressLine,
  Contact,
  Country,
  Item,
  Party,
  PartyLegalEntity,
  PostalAddress,
  Price,
  TaxCategory,
  TaxScheme,
  TaxSubtotal,
  TaxTotal,
} from '../../src/ubl21/CommonAggregateComponents';
import { CommodityClassification } from '../../src/ubl21/CommonAggregateComponents/CommodityClassification';
import { ItemPriceExtension } from '../../src/ubl21/CommonAggregateComponents/ItemPriceExtension';
import { Invoice } from '../../src/ubl21/schemaDocuments';
import {
  UdtAmount,
  UdtCode,
  UdtIdentifier,
  UdtPercent,
  UdtQuantity,
  UdtText,
} from '../../src/ubl21/types/UnqualifiedDataTypes';

/**
 * Reproduces the element structure of a MyInvois v1.0 invoice that LHDN
 * accepted in production (status "Valid"), with every identifying value
 * replaced by a synthetic one.
 *
 * The shape — element sequence, attributes, cardinality — is verbatim from
 * that document. Only the data is invented.
 */
export function buildMyInvoisInvoice(): Invoice {
  const CURRENCY = 'MYR';
  const money = (v: string) => new UdtAmount(v, { currencyID: CURRENCY });
  const taxScheme = () =>
    new TaxScheme({ id: new UdtIdentifier('OTH', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }) });

  const invoice = new Invoice();

  invoice
    .addProperty('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')
    .addProperty('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
    .addProperty('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
    .setID('INV-0000-00001')
    .setIssueDate('2026-07-02')
    .setIssueTime('02:02:36Z')
    .setInvoiceTypeCode('01', { listVersionID: '1.0' })
    .setDocumentCurrencyCode(CURRENCY)
    .setTaxCurrencyCode(CURRENCY);

  invoice.addInvoicePeriod({
    startDate: '2026-06-08',
    startTime: '02:20:02Z',
    endDate: '2026-06-08',
    endTime: '02:20:02Z',
  });

  const supplier = new Party({
    industryClassificationCode: new UdtCode('86909', { name: 'EXAMPLE MEDICAL SERVICES' }),
    postalAddress: new PostalAddress({
      cityName: 'KUALA LUMPUR',
      postalZone: '50000',
      countrySubentityCode: '14',
      addressLine: [new AddressLine({ line: '1 Jalan Contoh' })],
      country: new Country({
        identificationCode: new UdtCode('MYS', { listID: 'ISO3166-1', listAgencyID: '6' }),
      }),
    }),
    partyLegalEntities: [new PartyLegalEntity({ registrationName: 'EXAMPLE CLINIC SDN. BHD.' })],
    contact: new Contact({ name: 'EXAMPLE CLINIC SDN. BHD.', telephone: '+60312345678' }),
  });

  supplier
    .addPartyIdentification({ id: new UdtIdentifier('C00000000000', { schemeID: 'TIN' }) })
    .addPartyIdentification({ id: new UdtIdentifier('000000000000', { schemeID: 'BRN' }) })
    .addPartyIdentification({ id: new UdtIdentifier('NA', { schemeID: 'SST' }) })
    .addPartyIdentification({ id: new UdtIdentifier('NA', { schemeID: 'TTX' }) });

  const customer = new Party({
    postalAddress: new PostalAddress({
      cityName: 'KUALA LUMPUR',
      postalZone: '50000',
      countrySubentityCode: '14',
      addressLine: [new AddressLine({ line: '2 Jalan Contoh' }), new AddressLine({ line: 'Taman Contoh' })],
      country: new Country({
        identificationCode: new UdtCode('MYS', { listID: 'ISO3166-1', listAgencyID: '6' }),
      }),
    }),
    partyLegalEntities: [new PartyLegalEntity({ registrationName: 'EXAMPLE BUYER' })],
    contact: new Contact({ name: 'EXAMPLE BUYER', telephone: '+60312345679' }),
  });

  customer
    .addPartyIdentification({ id: new UdtIdentifier('IG00000000000', { schemeID: 'TIN' }) })
    .addPartyIdentification({ id: new UdtIdentifier('000000000000', { schemeID: 'NRIC' }) })
    .addPartyIdentification({ id: new UdtIdentifier('NA', { schemeID: 'SST' }) })
    .addPartyIdentification({ id: new UdtIdentifier('NA', { schemeID: 'TTX' }) });

  invoice.setAccountingSupplierParty(new AccountingSupplierParty({ party: supplier }));
  invoice.setAccountingCustomerParty(new AccountingCustomerParty({ party: customer }));

  invoice.addTaxTotal(
    new TaxTotal({
      taxAmount: money('0.00'),
      taxSubtotals: [
        new TaxSubtotal({
          taxableAmount: money('0.00'),
          taxAmount: money('0.00'),
          taxCategory: new TaxCategory({ id: '06', taxScheme: taxScheme() }),
        }),
      ],
    }),
  );

  invoice.setLegalMonetaryTotal({
    lineExtensionAmount: money('90.00'),
    taxExclusiveAmount: money('90.00'),
    taxInclusiveAmount: money('90.00'),
    payableAmount: money('90.00'),
  });

  invoice.addInvoiceLine({
    id: '1',
    invoicedQuantity: new UdtQuantity('60.00', { unitCode: 'XUN' }),
    lineExtensionAmount: money('90.00'),
    taxTotals: [
      new TaxTotal({
        taxAmount: money('0.00'),
        taxSubtotals: [
          new TaxSubtotal({
            taxAmount: money('0.00'),
            percent: new UdtPercent('0.00'),
            taxCategory: new TaxCategory({ id: '06', taxScheme: taxScheme() }),
          }),
        ],
      }),
    ],
    item: new Item({
      descriptions: [new UdtText('Consultation')],
      commodityClassification: [
        new CommodityClassification({
          itemClassificationCode: new UdtCode('020', { listID: 'CLASS' }),
        }),
      ],
    }),
    price: new Price({ priceAmount: money('1.50') }),
    itemPriceExtension: new ItemPriceExtension({ amount: money('90.00') }),
  });

  return invoice;
}
