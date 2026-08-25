import { InvoiceLine, Item, Price, TaxTotal } from '../../src/cac';

const line = () =>
  new InvoiceLine({
    id: '1',
    invoicedQuantity: '2',
    lineExtensionAmount: '100.00',
    item: new Item({}),
    price: new Price({ priceAmount: '50.00' }),
  });

describe('InvoiceLine', () => {
  it('exposes the line extension amount through getter and setter', () => {
    const invoiceLine = line();
    expect(invoiceLine.getLineExtensionAmount()).toBe('100.00');

    invoiceLine.setLineExtensionAmount('150.00');
    expect(invoiceLine.getLineExtensionAmount()).toBe('150.00');
  });

  it('rejects tax totals that are not an array', () => {
    expect(() => line().setTaxTotals({} as never)).toThrow('value must to be an Array');
  });

  it('rejects array items that are not TaxTotal instances', () => {
    expect(() => line().setTaxTotals([{} as never])).toThrow('All items must to be instance of TaxTotal class');
  });

  it('stores tax totals supplied as instances', () => {
    const invoiceLine = line();
    invoiceLine.setTaxTotals([new TaxTotal({ taxAmount: '19.00', taxSubtotals: [] })]);

    expect(invoiceLine.getTaxTotals()).toHaveLength(1);
  });

  it('setId replaces the identifier', () => {
    const invoiceLine = line();
    invoiceLine.setId('99');

    expect(invoiceLine.parseToJson()['cbc:ID']['#']).toBe('99');
  });

  it('getPrice returns the instance it was given', () => {
    const price = new Price({ priceAmount: '50.00' });
    const invoiceLine = new InvoiceLine({
      id: '1',
      invoicedQuantity: '2',
      lineExtensionAmount: '100.00',
      item: new Item({}),
      price,
    });

    expect(invoiceLine.getPrice()).toBe(price);
  });
});
