import { UdtTime } from '../../src/datatypes/udt';

describe('UdtTime', () => {
  it('should construct JSON correctly', () => {
    const text = new UdtTime('2025-01-01');
    const json = text.parseToJson();

    expect(json).toStrictEqual({
      '#': '2025-01-01',
    });
  });
});
