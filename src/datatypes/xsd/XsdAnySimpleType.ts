import { toXmlObject } from '../../core/serialize';
import { XmlContent } from '../../core/xmlNode';
import { IDictionary } from '../generics/IDictionary';
import { IXsdAnySimpleType } from './IXsdAnySimpleType';

export default class XsdAnySimpleType implements IXsdAnySimpleType {
  content: string | number | boolean;
  attributes: IDictionary<string> = {};

  /**
   * @param content Simple content as string
   */
  constructor(content: string | number | boolean, attributes?: any) {
    /** Simple content as string */
    this.content = content !== null && content !== undefined ? content : '';
    this.applyAttributes(attributes || {});
  }

  /**
   * Describe this value as a neutral node.
   *
   * Every simple type serializes the same way — a value plus its supplementary
   * component attributes — so this is the single implementation for all of
   * them. Ten subclasses previously carried byte-identical copies of it.
   */
  toNode(): XmlContent {
    return { value: this.content, attributes: { ...this.attributes } };
  }

  /**
   * @deprecated Prefer {@link toNode}. Retained because Invoice and the test
   * suite still read the xmlbuilder2 dialect directly.
   */
  parseToJson(): any {
    return toXmlObject(this.toNode());
  }

  validateContent() {
    return;
  }

  private applyAttributes(attributes: any) {
    Object.keys(attributes)
      .filter((att) => attributes[att])
      .forEach((att: string) => (this.attributes[att] = attributes[att]));
  }
}
