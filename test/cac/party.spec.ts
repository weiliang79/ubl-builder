import { Party, PartyIdentification, PartyName } from '../../src/cac';
import { UdtIdentifier } from '../../src/datatypes/udt';

describe('Party', () => {
  it('adds a party name from a string', () => {
    const party = new Party({});
    party.addPartyName('ACME Corp');

    const json = party.parseToJson();
    expect(json['cac:PartyName']).toHaveLength(1);
    expect(json['cac:PartyName'][0]).toStrictEqual({ 'cbc:Name': { '#': 'ACME Corp' } });
  });

  it('adds a party identification from a params object', () => {
    const party = new Party({});
    party.addPartyIdentification({ id: '900123456' });

    expect(party.parseToJson()['cac:PartyIdentification']).toStrictEqual([{ 'cbc:ID': { '#': '900123456' } }]);
  });

  it('accepts concrete instances in add methods', () => {
    const party = new Party({});
    party.addPartyName(new PartyName({ name: 'Instance Name' }));
    party.addPartyIdentification(new PartyIdentification({ id: 'ID-1' }));

    const json = party.parseToJson();
    expect(json['cac:PartyName'][0]['cbc:Name']['#']).toBe('Instance Name');
    expect(json['cac:PartyIdentification'][0]['cbc:ID']['#']).toBe('ID-1');
  });

  it('rejects a party name that is neither PartyName nor string', () => {
    const party = new Party({});

    expect(() => party.addPartyName(123 as never)).toThrow('Value must be instance of PartyName or a string');
  });

  it('accumulates multiple identifications in insertion order', () => {
    // MyInvois supplies TIN, BRN, SST and TTX as four separate identifications.
    const party = new Party({});
    ['TIN', 'BRN', 'SST', 'TTX'].forEach((schemeID) =>
      party.addPartyIdentification({ id: new UdtIdentifier(schemeID, { schemeID }) }),
    );

    const ids = party.parseToJson()['cac:PartyIdentification'];
    expect(ids).toHaveLength(4);
    expect(ids.map((i: Record<string, Record<string, string>>) => i['cbc:ID']['@schemeID'])).toStrictEqual([
      'TIN',
      'BRN',
      'SST',
      'TTX',
    ]);
  });
});
