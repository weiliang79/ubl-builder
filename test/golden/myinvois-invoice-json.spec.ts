import { readFileSync } from 'fs';
import { join } from 'path';
import { buildMyInvoisInvoice } from './myinvois-invoice.builder';

const FIXTURE = join(__dirname, '..', 'fixtures', 'myinvois-invoice.json');

/** Every text value in the XML, in document order. */
function xmlValues(xml: string): string[] {
  return [...xml.matchAll(/<[a-zA-Z:]+[^>]*>([^<]+)</g)].map((m) => m[1]);
}

/** Every `_` value in the JSON tree, in document order. */
function jsonValues(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(jsonValues);
  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>;
    return Object.entries(record).flatMap(([key, value]) =>
      key === '_' ? [String(value)] : key.startsWith('_') ? [] : jsonValues(value),
    );
  }
  return [];
}

describe('golden: MyInvois invoice as UBL JSON', () => {
  const invoice = buildMyInvoisInvoice();
  const json = invoice.getJson();
  const golden = JSON.parse(readFileSync(FIXTURE, 'utf8'));

  it('reproduces the golden JSON fixture', () => {
    expect(json).toStrictEqual(golden);
  });

  it('declares namespaces as _D / _A / _B rather than xmlns attributes', () => {
    expect(json._D).toBe('urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');
    expect(json._A).toBe('urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
    expect(json._B).toBe('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');

    const [invoiceBody] = json.Invoice as Record<string, unknown>[];
    expect(Object.keys(invoiceBody).some((k) => k.startsWith('xmlns'))).toBe(false);
  });

  it('never emits an element as a bare object; elements are always arrays', () => {
    // Attributes are plain keys too, so "every non-_ key is an array" would be
    // wrong. The invariant is narrower: a nested object only ever appears
    // inside an array, so no property value is a non-array object.
    const walk = (node: unknown, path: string): void => {
      if (Array.isArray(node)) {
        node.forEach((item, i) => walk(item, `${path}[${i}]`));
        return;
      }
      if (!node || typeof node !== 'object') return;
      Object.entries(node as Record<string, unknown>).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          throw new Error(`${path}.${key} is a bare object; elements must be arrays`);
        }
        walk(value, `${path}.${key}`);
      });
    };

    expect(() => walk(json, '$')).not.toThrow();
  });

  it('puts content under _ and attributes alongside it', () => {
    const [body] = json.Invoice as Record<string, unknown>[];
    const [typeCode] = body.InvoiceTypeCode as Record<string, unknown>[];

    expect(typeCode).toStrictEqual({ _: '01', listVersionID: '1.0' });
  });

  it('drops namespace prefixes from element names', () => {
    const [body] = json.Invoice as Record<string, unknown>[];

    expect(body).toHaveProperty('ID'); // was cbc:ID
    expect(body).toHaveProperty('AccountingSupplierParty'); // was cac:AccountingSupplierParty
    expect(Object.keys(body).some((k) => k.includes(':'))).toBe(false);
  });

  it('carries exactly the same values as the XML rendering', () => {
    // The point of the neutral IR: one document model, two renderings.
    expect(jsonValues(json)).toStrictEqual(xmlValues(invoice.getXml(false, true)));
  });
});
