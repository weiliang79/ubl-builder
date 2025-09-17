import { XsdDecimal } from '../xsd';

export type AllowedAttributes = {
  /** The currency of the amount */
  currencyID?: string;
  /** The VersionID of the UN/ECE Rec9 code list. */
  currencyCodeListVersionID?: string;
};

/**
 * A number of monetary units specified in a currency where the unit of the currency is explicit or implied.
 * More info: http://www.datypic.com/sc/ubl21/t-cct_AmountType.html
 */
export class CctAmountType extends XsdDecimal {
  /**
   * @param content
   * @param attributes
   */
  constructor(content: string, attributes?: AllowedAttributes) {
    super(content, attributes);
  }

  parseToJson() {
    const jsonResult: any = { '#': this.content };
    Object.keys(this.attributes)
      .filter((att) => this.attributes[att])
      .forEach((attribute: string) => {
        jsonResult[`@${attribute}`] = this.attributes[attribute];
      });
    return jsonResult;
  }

  setCurrencyID(value: string) {
    this.attributes.currencyID = value;
  }

  setCurrencyCodeListVersionID(value: string) {
    this.attributes.currencyCodeListVersionID = value;
  }
}
