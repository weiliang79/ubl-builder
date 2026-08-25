import { ContractDocumentReference, DespatchDocumentReference } from '../../src/cac';

describe('DocumentReference family', () => {
  // Eight classes share one ParamsMap and one AllowedParams — in UBL they are
  // a single complex type (DocumentReferenceType) appearing at eight element
  // positions. They are kept as distinct classes rather than collapsed to
  // aliases for two reasons, both asserted here.
  it('each carries its own element name', () => {
    expect(new DespatchDocumentReference({ id: 'DN-1' } as never).getAsXml(false, true)).toBe(
      '<cac:DespatchDocumentReference><cbc:ID>DN-1</cbc:ID></cac:DespatchDocumentReference>',
    );
    expect(new ContractDocumentReference({ id: 'CT-1' } as never).getAsXml(false, true)).toBe(
      '<cac:ContractDocumentReference><cbc:ID>CT-1</cbc:ID></cac:ContractDocumentReference>',
    );
  });

  it('stays distinguishable by instanceof', () => {
    // Invoice.ts guards six add* methods with these checks.
    expect(new ContractDocumentReference({ id: 'X' } as never) instanceof DespatchDocumentReference).toBe(false);
  });
});
