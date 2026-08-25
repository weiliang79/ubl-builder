import { UdtIdentifier, UdtIdentifierAttributes } from './UdtIdentifier';

export type UBLVersionIDAttributes = UdtIdentifierAttributes;

/**
 * A character string to identify and distinguish uniquely,
 * one instance of an object in an identification scheme from all other objects in
 * the same scheme together with relevant supplementary information.
 */
export class UBLVersionID extends UdtIdentifier {
  constructor(content: string, attributes?: UdtIdentifierAttributes) {
    super(content, attributes);
  }
}
