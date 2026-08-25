import { UdtIdentifier, UdtIdentifierAttributes } from '../udt/UdtIdentifier';

export type UBLVersionIDAttributes = UdtIdentifierAttributes;

/**
 * `cbc:UBLVersionID` — the earliest UBL minor version this document is
 * compatible with.
 *
 * The schema declares `UBLVersionIDType` in the cbc namespace as an extension
 * of `udt:IdentifierType`, which is why this is a cbc type and not a udt one
 * despite living next to them until now.
 *
 * MyInvois omits this element entirely; it carries its version in
 * `cbc:InvoiceTypeCode/@listVersionID` instead.
 */
export class UBLVersionID extends UdtIdentifier {
  constructor(content: string, attributes?: UdtIdentifierAttributes) {
    super(content, attributes);
  }
}
