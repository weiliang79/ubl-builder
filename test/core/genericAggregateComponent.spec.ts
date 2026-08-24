import GenericAggregateComponent, {
  IGenericKeyValue,
  ParamsMapValues,
} from '../../src/ubl21/CommonAggregateComponents/GenericAggregateComponent';
import { UdtIdentifier, UdtName } from '../../src/ubl21/types/UnqualifiedDataTypes';

const singleId: IGenericKeyValue<ParamsMapValues> = {
  id: { order: 1, attributeName: 'cbc:ID', min: 0, max: 1, classRef: UdtIdentifier },
};

describe('GenericAggregateComponent', () => {
  describe('element order', () => {
    it('follows `order`, not the declaration order of the params map', () => {
      // UBL complex types are xsd:sequence — MyInvois rejects an incorrect
      // sequence with "Invalid Structure". Before this was sorted, output
      // order came from the object literal, so an innocuous reorder during a
      // refactor silently produced schema-invalid XML.
      const declaredOutOfOrder: IGenericKeyValue<ParamsMapValues> = {
        name: { order: 2, attributeName: 'cbc:Name', min: 0, max: 1, classRef: UdtName },
        id: { order: 1, attributeName: 'cbc:ID', min: 0, max: 1, classRef: UdtIdentifier },
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
});
