import { AddressLine } from '../../src/ubl21/CommonAggregateComponents';
import { UdtText } from '../../src/ubl21/types/UnqualifiedDataTypes';

describe('AddressLine', () => {
  it('accepts a UdtText instance', () => {
    const addressLine = new AddressLine({ line: new UdtText('Line from UDT') });

    expect(addressLine.getLine(true)).toBe('Line from UDT');
    expect(addressLine.getLine()).toBeInstanceOf(UdtText);
  });

  it('serializes cbc:Line from the constructor payload', () => {
    const addressLine = new AddressLine({ line: '1 Jalan Contoh' });

    expect(addressLine.parseToJson()['cbc:Line']['#']).toBe('1 Jalan Contoh');
  });

  it('serializes cbc:Line to XML', () => {
    const addressLine = new AddressLine({ line: 'Main street 10' });

    expect(addressLine.getAsXml(false, false)).toContain('<cbc:Line>Main street 10</cbc:Line>');
  });

  it('setLine replaces the value', () => {
    const addressLine = new AddressLine({ line: 'Line 1' });
    addressLine.setLine('Line 2');

    expect(addressLine.getLine(true)).toBe('Line 2');
  });

  it('setLine accepts a UdtText instance without rewrapping it', () => {
    const addressLine = new AddressLine({ line: 'Line 1' });
    const input = new UdtText('Line 2 from UDT');
    addressLine.setLine(input);

    expect(addressLine.getLine()).toBe(input);
  });
});
