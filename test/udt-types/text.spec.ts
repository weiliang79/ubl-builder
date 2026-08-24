import { UdtText } from '../../src/datatypes/udt';

describe('UdtText', () => {
  it('should construct JSON correctly', () => {
    const text = new UdtText('Testing Node', { languageID: 'en-US', languageLocaleID: 'en' });
    const json = text.parseToJson();

    expect(json).toStrictEqual({
      '#': 'Testing Node',
      '@languageID': 'en-US',
      '@languageLocaleID': 'en',
    });
  });
});
