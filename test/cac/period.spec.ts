import { PeriodType } from '../../src/cac';

describe('PeriodType', () => {
  it('serializes start and end dates from the constructor payload', () => {
    const json = new PeriodType({ startDate: '2024-12-19', endDate: '2025-01-19' }).parseToJson();

    expect(json['cbc:StartDate']['#']).toBe('2024-12-19');
    expect(json['cbc:EndDate']['#']).toBe('2025-01-19');
  });

  it('supports fluent setters', () => {
    const period = new PeriodType({});
    const result = period.setStartDate('2024-12-19').setEndDate('2025-01-19');

    expect(result).toBe(period);
    expect(period.parseToJson()['cbc:StartDate']['#']).toBe('2024-12-19');
    expect(period.parseToJson()['cbc:EndDate']['#']).toBe('2025-01-19');
  });

  it('exposes addStartDate/addEndDate aliases', () => {
    const period = new PeriodType({});
    period.addStartDate('2024-12-19').addEndDate('2025-01-19');

    const json = period.parseToJson();
    expect(json['cbc:StartDate']['#']).toBe('2024-12-19');
    expect(json['cbc:EndDate']['#']).toBe('2025-01-19');
  });

  it('getAsXml cannot serialize a component with more than one child', () => {
    // Documented limitation, not desired behaviour. getAsXml() feeds
    // parseToJson() straight to xmlbuilder2's create(), which rejects a
    // document with multiple roots. It happens to work for single-child
    // components such as AddressLine and fails for everything else.
    //
    // The wrapper element name every component already passes to super()
    // — 'cac:InvoicePeriod' here — is exactly what it lacks, and that
    // argument is currently ignored. See D5 in the decision record.
    const period = new PeriodType({ startDate: '2024-12-19', endDate: '2025-01-19' });

    expect(() => period.getAsXml(false, true)).toThrow(/Document already has a document element/);
  });

  it('emits dates in schema sequence regardless of assignment order', () => {
    const period = new PeriodType({});
    period.setEndDate('2025-01-19').setStartDate('2024-12-19');

    expect(Object.keys(period.parseToJson())).toStrictEqual(['cbc:StartDate', 'cbc:EndDate']);
  });
});
