import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildMyInvoisInvoice } from './myinvois-invoice.builder';

const FIXTURE = join(__dirname, '..', 'fixtures', 'myinvois-invoice.xml');

/**
 * Golden-file regression guard.
 *
 * The fixture's element structure is verbatim from a MyInvois v1.0 invoice
 * that LHDN accepted in production (status "Valid"); only the data is
 * synthetic. Any change to serialization, element order, or cardinality
 * handling shows up here as a diff.
 *
 * If this fails, do not update the fixture until you can explain the diff.
 */
describe('golden: MyInvois invoice', () => {
  const generated = buildMyInvoisInvoice().getXml(false, true);
  const golden = readFileSync(FIXTURE, 'utf8');

  it('reproduces the golden fixture byte for byte', () => {
    expect(generated).toStrictEqual(golden);
  });

  it('emits no XML declaration and no line breaks', () => {
    // MyInvois submissions use getXml(false, true); documentHash is computed
    // over exactly these bytes, so both properties are load-bearing.
    expect(generated.startsWith('<?xml')).toBe(false);
    expect(generated).not.toContain('\n');
  });

  it('keeps documentHash stable (sha256 hex of the raw document)', () => {
    const hash = createHash('sha256').update(generated).digest('hex');
    expect(hash).toHaveLength(64);
    expect(hash).toStrictEqual(createHash('sha256').update(golden).digest('hex'));
  });

  it('preserves the UBL element sequence required by MyInvois', () => {
    // MyInvois rejects out-of-sequence elements with "Invalid Structure".
    const order = [...generated.matchAll(/<(cbc|cac):([A-Za-z]+)[ >]/g)].map((m) => `${m[1]}:${m[2]}`);
    const topLevel = order.slice(0, 7);
    expect(topLevel).toStrictEqual([
      'cbc:ID',
      'cbc:IssueDate',
      'cbc:IssueTime',
      'cbc:InvoiceTypeCode',
      'cbc:DocumentCurrencyCode',
      'cbc:TaxCurrencyCode',
      'cac:InvoicePeriod',
    ]);
  });
});
