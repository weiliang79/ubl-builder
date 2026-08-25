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

  it('serializes standalone inside its default element', () => {
    const period = new PeriodType({ startDate: '2024-12-19', endDate: '2025-01-19' });

    expect(period.getAsXml(false, true)).toBe(
      '<cac:InvoicePeriod><cbc:StartDate>2024-12-19</cbc:StartDate>' +
        '<cbc:EndDate>2025-01-19</cbc:EndDate></cac:InvoicePeriod>',
    );
  });

  it('accepts an element name override, because the name is contextual', () => {
    // PeriodType is cac:InvoicePeriod under Invoice and cac:ValidityPeriod
    // under Price. Only the caller knows which position it occupies.
    const period = new PeriodType({ startDate: '2024-12-19', endDate: '2025-01-19' });

    expect(period.getAsXml(false, true, 'cac:ValidityPeriod')).toContain('<cac:ValidityPeriod>');
  });

  it('emits dates in schema sequence regardless of assignment order', () => {
    const period = new PeriodType({});
    period.setEndDate('2025-01-19').setStartDate('2024-12-19');

    expect(Object.keys(period.parseToJson())).toStrictEqual(['cbc:StartDate', 'cbc:EndDate']);
  });
});
