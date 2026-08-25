import { create } from 'xmlbuilder2';

export type ParamsMapValues = {
  order: number;
  attributeName: string;
  min: number;
  max?: number;
  classRef: any;
};

export interface IGenericKeyValue<T> {
  [id: string]: T;
}

/**
 * Generic class to avoid repeat several code in all CommonAggregateComponent files
 */
export default class GenericAggregateComponent {
  private paramsMap: IGenericKeyValue<ParamsMapValues> = {};
  protected attributes: IGenericKeyValue<any> = {};

  /**
   * Default element name used when this component is serialized on its own.
   *
   * It is only a default. A component's element name is decided by its
   * *parent* — the `attributeName` in the parent's params map — because the
   * same UBL type appears under different names depending on position:
   * PeriodType is cac:InvoicePeriod under Invoice and cac:ValidityPeriod
   * under Price. Pass an explicit name to getAsXml() when the default is
   * not the one you want.
   */
  protected readonly elementName: string;

  /**
   * @param content component content
   * @param paramsMap Params Map
   * @param [elementName="GenericAggregateComponent"] default element name
   */
  constructor(
    content: any,
    paramsMap: IGenericKeyValue<ParamsMapValues>,
    elementName = 'GenericAggregateComponent',
  ) {
    this.elementName = elementName;
    this.paramsMap = paramsMap;
    this.assignContent(content);
  }

  parseToJson() {
    const jsonResponse: any = {};
    Object.keys(this.paramsMap)
      .filter((attkey) => this.attributes[attkey] !== undefined && this.attributes[attkey] !== null)
      // UBL complex types are xsd:sequence, so element order is significant.
      // Sorting on `order` makes that explicit rather than relying on the
      // declaration order of the params map object literal.
      .sort((a, b) => this.paramsMap[a].order - this.paramsMap[b].order)
      .forEach((attKey) => {
        const { attributeName, max } = this.paramsMap[attKey];
        if (Array.isArray(this.attributes[attKey]) && max !== undefined) {
          throw new Error('array given and max is defined validate structure');
        }
        jsonResponse[attributeName] = Array.isArray(this.attributes[attKey])
          ? this.attributes[attKey].map((e: any) => e.parseToJson())
          : this.attributes[attKey].parseToJson();
      });
    return jsonResponse;
  }

  assignContent(content: any) {
    Object.keys(content || {})
      .filter((att) => content[att] != null)
      .forEach((att: string) => {
        const mapValue = this.paramsMap[att];
        if (!mapValue) {
          throw new Error(`attribute ${att} is not allowed`);
        }

        const { classRef: AbstractClass, max } = mapValue;
        if (!AbstractClass) {
          throw new Error('classRef is required');
        }

        if (Array.isArray(content[att])) {
          if (max !== undefined && content[att].length > max) {
            throw new Error(`${att} max occurrences is ${max}`);
          }

          this.attributes[att] = content[att].map((subItem: any) => this.buildClassInstance(AbstractClass, subItem));
        } else {
          this.attributes[att] = this.buildClassInstance(AbstractClass, content[att]);
        }
      });
  }

  private buildClassInstance(AbstractClass: any, rawValue: any) {
    if (rawValue instanceof AbstractClass) {
      return rawValue;
    }

    if (['boolean', 'string', 'number'].includes(typeof rawValue)) {
      return new AbstractClass(rawValue);
    }

    return new AbstractClass(rawValue?.content, rawValue?.attributes || {});
  }

  /**
   * Serialize this component on its own, wrapped in a single root element.
   *
   * The wrapper is required: parseToJson() returns one key per child, and an
   * XML document cannot have more than one root. Without it this threw
   * "Document already has a document element" for every component with more
   * than one child, and silently emitted a bare, unwrapped child for the rest.
   *
   * @param {boolean} [pretty=true] pretty-print the output
   * @param {boolean} [headless=false] omit the XML declaration
   * @param {string} [elementName] override the default element name; see
   *        {@link elementName} for why the default may not be the right one
   */
  getAsXml(pretty = true, headless = false, elementName: string = this.elementName) {
    const xmlRef = { [elementName]: this.parseToJson() };
    // headless belongs to end(), not create(); passing it to create() silently
    // did nothing, so the declaration was emitted regardless of the argument.
    return create({ version: '1.0', encoding: 'UTF-8', standalone: false }, xmlRef).end({
      headless,
      prettyPrint: pretty,
    });
  }

  /**
   * @param {boolean} [deep=false] true for deep print
   */
  getAsJson(_deep = false) {
    return this.parseToJson();
  }
}
