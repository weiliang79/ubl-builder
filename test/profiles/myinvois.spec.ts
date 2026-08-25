import { Invoice } from '../../src/documents';
import {
  DocumentTypeCode,
  DocumentVersion,
  myInvois,
  otherTaxScheme,
  TaxCategoryCode,
} from '../../src/profiles/myinvois';

describe('MyInvois profile', () => {
  it('declares only the three UBL namespaces MyInvois uses', () => {
    // Verified against the LHDN SDK: MyInvois uses neither UBLVersionID,
    // CustomizationID nor ProfileID, so defaults() has nothing else to stamp.
    const invoice = new Invoice('INV-1');
    myInvois.defaults!(invoice);

    const xml = invoice.getXml(false, true);
    expect(xml).toContain('xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"');
    expect(xml).toContain('xmlns:cac=');
    expect(xml).toContain('xmlns:cbc=');
    expect(xml).not.toContain('CustomizationID');
    expect(xml).not.toContain('ProfileID');
    // DIAN's namespace used to be hardcoded into the core document
    expect(xml).not.toContain('xmlns:sts');
  });

  it('carries the document version in InvoiceTypeCode, not UBLVersionID', () => {
    const invoice = new Invoice('INV-1');
    myInvois.defaults!(invoice);
    invoice.setInvoiceTypeCode(DocumentTypeCode.Invoice, { listVersionID: DocumentVersion.Unsigned });

    expect(invoice.getXml(false, true)).toContain('<cbc:InvoiceTypeCode listVersionID="1.0">01</cbc:InvoiceTypeCode>');
  });

  it('finalize is a no-op at document version 1.0', () => {
    // v1.1 enables signature validation; the structure is identical.
    expect(() => myInvois.finalize!(new Invoice('INV-1'))).not.toThrow();
  });

  it('builds a fresh tax scheme per call', () => {
    // A shared instance would be one mutable node in several places.
    expect(otherTaxScheme()).not.toBe(otherTaxScheme());
    expect(otherTaxScheme().getAsXml(false, true)).toBe(
      '<cac:TaxScheme><cbc:ID schemeID="UN/ECE 5153" schemeAgencyID="6">OTH</cbc:ID></cac:TaxScheme>',
    );
  });

  it('exposes the LHDN tax type codes', () => {
    expect(TaxCategoryCode).toStrictEqual({
      SalesTax: '01',
      ServiceTax: '02',
      TourismTax: '03',
      HighValueGoodsTax: '04',
      SalesTaxOnLowValueGoods: '05',
      NotApplicable: '06',
      Exempt: 'E',
    });
  });
});
