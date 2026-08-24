import { TaxCategory, TaxScheme, TaxSubtotal, TaxTotal } from '../../src/cac';
import { UdtIdentifier } from '../../src/datatypes/udt';

// cac:TaxCategory is [1..1] on TaxSubtotal, so every subtotal needs one.
const category = () =>
  new TaxCategory({
    id: '06',
    taxScheme: new TaxScheme({ id: new UdtIdentifier('OTH', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }) }),
  });

const subtotal = (taxAmount: string) => new TaxSubtotal({ taxAmount, taxCategory: category() });

describe('TaxTotal', () => {
  it('exposes the tax amount through getter and setter', () => {
    const taxTotal = new TaxTotal({ taxAmount: '19.00', taxSubtotals: [] });
    expect(taxTotal.getTaxAmount()).toBe('19.00');

    taxTotal.setTaxAmount('20.00');
    expect(taxTotal.getTaxAmount()).toBe('20.00');
  });

  it('sums subtotal tax amounts numerically', () => {
    // getTaxAmount() yields raw string content, so the previous reduce
    // concatenated: ['10', '2.5'] produced '0102.5' instead of 12.5.
    const taxTotal = new TaxTotal({
      taxAmount: '0',
      taxSubtotals: [subtotal('10'), subtotal('2.5')],
    });

    expect(taxTotal.calculateTotalTaxAmount()).toBe(12.5);
  });

  it('sums to zero when there are no subtotals', () => {
    expect(new TaxTotal({ taxAmount: '0', taxSubtotals: [] }).calculateTotalTaxAmount()).toBe(0);
  });

  it('rejects tax subtotals that are not an array', () => {
    const taxTotal = new TaxTotal({ taxAmount: '0', taxSubtotals: [] });

    expect(() => taxTotal.setTaxSubtotals({} as never)).toThrow('taxSubtotals must to be an Array');
  });

  it('rejects array items that are not TaxSubtotal instances', () => {
    const taxTotal = new TaxTotal({ taxAmount: '0', taxSubtotals: [] });

    expect(() => taxTotal.setTaxSubtotals([{} as never])).toThrow(
      'Items of taxSubtotals must be instance of TaxSubtotal class',
    );
  });
});
