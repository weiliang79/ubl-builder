import { UdtDate, UdtTime } from '../../src/datatypes/udt';

describe('UdtTime', () => {
  it('serializes a time of day', () => {
    // the value production submits
    expect(new UdtTime('02:02:36Z').parseToJson()).toStrictEqual({ '#': '02:02:36Z' });
  });

  it.each(['00:00:00', '23:59:59', '02:02:36Z', '12:30:00.500', '08:15:00+08:00', '08:15:00-05:00'])(
    'accepts %s',
    (value) => {
      expect(() => new UdtTime(value)).not.toThrow();
    },
  );

  it('rejects a date, which it used to accept', () => {
    // UdtTime extended XsdDate rather than XsdTime, and validateContent was a
    // no-op on the base, so any string at all was valid. The previous version
    // of this test asserted that '2025-01-01' was a valid time.
    expect(() => new UdtTime('2025-01-01')).toThrow(/invalid xsd:time/);
  });

  it.each(['25:00:00', '12:60:00', 'noon', '02:02'])('rejects %s', (value) => {
    expect(() => new UdtTime(value)).toThrow(/invalid xsd:time/);
  });
});

describe('UdtDate', () => {
  it.each(['2026-07-02', '2026-06-08', '2026-01-01Z', '2026-07-02+08:00'])('accepts %s', (value) => {
    expect(() => new UdtDate(value)).not.toThrow();
  });

  it.each(['02:02:36Z', '2026-13-01', '2026-07-32', 'yesterday'])('rejects %s', (value) => {
    expect(() => new UdtDate(value)).toThrow(/invalid xsd:date/);
  });

  it('treats an empty value as unset rather than invalid', () => {
    // Whether a field is required is cardinality, decided by the params map.
    expect(() => new UdtDate('')).not.toThrow();
  });
});
