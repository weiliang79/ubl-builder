import { UdtTime } from '../../src/ubl21/types/UnqualifiedDataTypes';

describe('UdtTime', () => {
  it('should construct JSON correctly', () => {
    const text = new UdtTime('2025-01-01');
    const json = text.parseToJson();

    expect(json).toStrictEqual({
      '#': '2025-01-01',
    });
  });
});
