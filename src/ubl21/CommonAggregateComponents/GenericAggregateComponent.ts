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
  // private classRefName: string;
  private paramsMap: IGenericKeyValue<ParamsMapValues> = {};
  protected attributes: IGenericKeyValue<any> = {};
  /**
   *
   * @param content component content
   * @param paramsMap Params Map
   * @param [name="GenericAggregateComponent"] Class name
   */
  constructor(content: any, paramsMap: IGenericKeyValue<ParamsMapValues>, _name = 'GenericAggregateComponent') {
    // this.classRefName = name;
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
   * @param {boolean} [pretty=true] true for print pretty. true by default
   * @param {boolean} [headless=false] false for print pretty. true by default
   *
   */
  getAsXml(pretty = true, headless = false) {
    const xmlRef = this.parseToJson();
    const xml = create(xmlRef, { encoding: 'UTF-8', standalone: false, headless }).end({ prettyPrint: pretty });
    return xml; // console.log(xml);
  }

  /**
   * @param {boolean} [deep=false] true for deep print
   */
  getAsJson(_deep = false) {
    return this.parseToJson();
  }
}
