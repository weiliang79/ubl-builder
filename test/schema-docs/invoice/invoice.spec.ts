import { Invoice, InvoiceOptions } from '../../../src/ubl21/schemaDocuments';

const invoiceOpts: InvoiceOptions = {
  enviroment: '1',
  issuer: {
    prefix: '4999',
    resolutionNumber: '321654987',
    startDate: '2025-01-01',
    endDate: '2025-01-01',
    startRange: '1000',
    endRange: '1000',
    technicalKey: '123123123123',
  },
  software: {
    id: '123123',
    pin: '123456789',
    providerNit: '91919191-90',
  },
};

describe('Invoice', () => {
  it('should construct a simple invoice XML document', () => {
    const invoice = new Invoice('12345', invoiceOpts);

    invoice.addProperty('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');
    invoice.addProperty('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
    invoice.addProperty('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');

    invoice.setID('12345');
    invoice.setIssueDate('2025-01-01');
    invoice.setIssueTime('00:00:00Z');

    const xml = invoice.getXml(false, true);
    expect(xml).toStrictEqual(
      `<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\"><cbc:ID>12345</cbc:ID><cbc:IssueDate>2025-01-01</cbc:IssueDate><cbc:IssueTime>00:00:00Z</cbc:IssueTime></Invoice>`,
    );
  });
});
