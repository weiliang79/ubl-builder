import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtCode, UdtIdentifier, UdtName, UdtText } from '../datatypes/udt';
import AnyExtensionContent from './AnyExtensionContent';

/*
    1     cbc:ID [0..1]     An identifier for the Extension assigned by the creator of the extension.
    2     cbc:Name [0..1]     A name for the Extension assigned by the creator of the extension.
    3     ext:ExtensionAgencyID [0..1]     An agency that maintains one or more Extensions.
    4     ext:ExtensionAgencyName [0..1]     The name of the agency that maintains the Extension.
    5     ext:ExtensionVersionID [0..1]     The version of the Extension.
    6     ext:ExtensionAgencyURI [0..1]     A URI for the Agency that maintains the Extension.
    7     ext:ExtensionURI [0..1]     A URI for the Extension.
    8     ext:ExtensionReasonCode [0..1]     A code for reason the Extension is being included.
    9     ext:ExtensionReason [0..1]     A description of the reason for the Extension.
    10    ext:ExtensionContent [1..1]     The definition of the extension content.
*/

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  id: {
    order: 1,
    attributeName: 'cbc:ID',
    max: 1,
    classRef: UdtIdentifier,
  },
  name: {
    order: 2,
    attributeName: 'cbc:Name',
    max: 1,
    classRef: UdtName,
  },
  extensionAgencyID: {
    order: 3,
    attributeName: 'ext:ExtensionAgencyID',
    max: 1,
    classRef: UdtIdentifier,
  },
  extensionAgencyName: {
    order: 4,
    attributeName: 'ext:ExtensionAgencyName',
    max: 1,
    classRef: UdtText,
  },
  extensionVersionID: {
    order: 5,
    attributeName: 'ext:ExtensionVersionID',
    max: 1,
    classRef: UdtIdentifier,
  },
  extensionAgencyURI: {
    order: 6,
    attributeName: 'ext:ExtensionAgencyURI',
    max: 1,
    classRef: UdtIdentifier,
  },
  extensionURI: {
    order: 7,
    attributeName: 'ext:ExtensionURI',
    max: 1,
    classRef: UdtIdentifier,
  },
  extensionReasonCode: {
    order: 8,
    attributeName: 'ext:ExtensionReasonCode',
    max: 1,
    classRef: UdtCode,
  },
  extensionReason: {
    order: 9,
    attributeName: 'ext:ExtensionReason',
    max: 1,
    classRef: UdtText,
  },
  extensionContent: {
    order: 10,
    attributeName: 'ext:ExtensionContent',
    max: 1,
    classRef: AnyExtensionContent,
  },
};

type AllowedParams = {
  id?: string | UdtIdentifier;
  name?: string | UdtName;
  extensionAgencyID?: string | UdtIdentifier;
  extensionAgencyName?: string | UdtText;
  extensionVersionID?: string | UdtIdentifier;
  extensionAgencyURI?: string | UdtIdentifier;
  extensionURI?: string | UdtIdentifier;
  extensionReasonCode?: string | UdtCode;
  extensionReason?: string | UdtText;
  extensionContent?: AnyExtensionContent;
};

/**
 *
 */
class UBLExtension extends GenericAggregateComponent {
  /**
   * @param {AllowedParams} content
   * @param {string} name
   */
  constructor(content: AllowedParams, name: string = 'ext:UBLExtension') {
    super(content, ParamsMap, name);
  }

  setExtensionContent(value: AnyExtensionContent) {
    if (!(value instanceof AnyExtensionContent)) {
      throw new Error('value must be an AnyExtensionContent instance');
    }
    this.attributes.extensionContent = value;
  }

  /**
   * @returns {AnyExtensionContent}
   */
  getExtensionContent(): AnyExtensionContent {
    return this.attributes.extensionContent;
  }
}

export { UBLExtension, AllowedParams as UBLExtensionParams };

/**
 * @deprecated The old names, kept so 0.1.x imports keep working.
 * `UBLExtensionType` was this file's exported name while the class it
 * declared was called `UBLExtension` — and the sibling file named
 * `UBLExtensionsType.ts` declared a *second* class also called
 * `UBLExtension`. Prefer {@link UBLExtension} / {@link UBLExtensionParams}.
 */
export { UBLExtension as UBLExtensionType, AllowedParams as UBLExtensionTypeParams };
