import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../../src/core/GenericAggregateComponent';
import { UdtIdentifier, UdtName } from '../../src/datatypes/udt';

const singleId: IGenericKeyValue<ParamsMapValues> = {
  id: { order: 1, attributeName: 'cbc:ID', max: 1, classRef: UdtIdentifier },
};

describe('GenericAggregateComponent', () => {
  describe('element order', () => {
    it('follows `order`, not the declaration order of the params map', () => {
      // UBL complex types are xsd:sequence — MyInvois rejects an incorrect
      // sequence with "Invalid Structure". Before this was sorted, output
      // order came from the object literal, so an innocuous reorder during a
      // refactor silently produced schema-invalid XML.
      const declaredOutOfOrder: IGenericKeyValue<ParamsMapValues> = {
        name: { order: 2, attributeName: 'cbc:Name', max: 1, classRef: UdtName },
        id: { order: 1, attributeName: 'cbc:ID', max: 1, classRef: UdtIdentifier },
      };

      const json = new GenericAggregateComponent({ id: 'X', name: 'Y' }, declaredOutOfOrder).parseToJson();

      expect(Object.keys(json)).toStrictEqual(['cbc:ID', 'cbc:Name']);
    });
  });

  describe('assignContent', () => {
    it('rejects an attribute the params map does not define', () => {
      expect(() => new GenericAggregateComponent({ nope: 'x' }, singleId)).toThrow('attribute nope is not allowed');
    });

    it('rejects an array longer than the declared max occurrences', () => {
      expect(() => new GenericAggregateComponent({ id: ['a', 'b'] }, singleId)).toThrow('id max occurrences is 1');
    });

    it('accepts an already-constructed instance without rewrapping it', () => {
      const id = new UdtIdentifier('X', { schemeID: 'TIN' });
      const component = new GenericAggregateComponent({ id }, singleId);

      expect(component.parseToJson()).toStrictEqual({ 'cbc:ID': { '#': 'X', '@schemeID': 'TIN' } });
    });

    it('accepts the { content, attributes } shape', () => {
      const component = new GenericAggregateComponent(
        { id: { content: 'X', attributes: { schemeID: 'BRN' } } },
        singleId,
      );

      expect(component.parseToJson()).toStrictEqual({ 'cbc:ID': { '#': 'X', '@schemeID': 'BRN' } });
    });
  });

  describe('parseToJson', () => {
    it('preserves falsy content rather than dropping the element', () => {
      // 0 is a real tax amount; MyInvois documents are full of them.
      expect(new GenericAggregateComponent({ id: 0 }, singleId).parseToJson()).toStrictEqual({
        'cbc:ID': { '#': 0 },
      });
    });

    it('omits attributes that were never assigned', () => {
      expect(new GenericAggregateComponent({}, singleId).parseToJson()).toStrictEqual({});
    });
  });

  describe('getAsXml', () => {
    it('wraps the component in its default element', () => {
      // Without a wrapper, parseToJson()'s one-key-per-child output is an
      // invalid XML document: a component with two children threw
      // "Document already has a document element", and one with a single
      // child emitted a bare, unwrapped child.
      const component = new GenericAggregateComponent({ id: 'X' }, singleId, 'cac:Example');

      expect(component.getAsXml(false, true)).toBe('<cac:Example><cbc:ID>X</cbc:ID></cac:Example>');
    });

    it('honours headless', () => {
      // headless was previously passed to create() instead of end(), where it
      // did nothing, so the declaration was emitted whatever the caller asked.
      const component = new GenericAggregateComponent({ id: 'X' }, singleId, 'cac:Example');

      expect(component.getAsXml(false, false).startsWith('<?xml')).toBe(true);
      expect(component.getAsXml(false, true).startsWith('<?xml')).toBe(false);
    });

    it('accepts an element name override', () => {
      const component = new GenericAggregateComponent({ id: 'X' }, singleId, 'cac:Example');

      expect(component.getAsXml(false, true, 'cac:Other')).toBe('<cac:Other><cbc:ID>X</cbc:ID></cac:Other>');
    });
  });
});
