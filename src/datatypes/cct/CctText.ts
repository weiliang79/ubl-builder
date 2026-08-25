import { XsdString } from '../xsd';

export type AllowedAttributes = {
  /**  The identification of the identification scheme */
  languageID?: string;
  /** The name of the identification scheme. */
  languageLocaleID?: string;
};
/**
 * A character string to identify and distinguish uniquely,
 * one instance of an object in an identification scheme from all other objects in
 * the same scheme together with relevant supplementary information.
 */
export class CctTextType extends XsdString {
  constructor(content: string, attributes?: AllowedAttributes) {
    super(content, attributes);
  }

  validateContent() {
    super.validateContent();
  }

  setLanguageID(value: string) {
    this.attributes.languageID = value;
  }

  setLanguageLocaleID(value: string) {
    this.attributes.languageLocaleID = value;
  }
}
