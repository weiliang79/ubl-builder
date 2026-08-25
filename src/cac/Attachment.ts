import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from '../core/GenericAggregateComponent';
import { UdtBinaryObject } from '../datatypes/udt';
import { ExternalReference } from './ExternalReference';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  embeddedDocumentBinaryObject: {
    order: 1,
    attributeName: 'cbc:EmbeddedDocumentBinaryObject',
    max: 1,
    classRef: UdtBinaryObject,
  },
  externalReference: {
    order: 2,
    attributeName: 'cac:ExternalReference',
    max: 1,
    classRef: () => ExternalReference,
  },
};

type AllowedParams = {
  /** A binary large object containing an attached document */
  embeddedDocumentBinaryObject?: UdtBinaryObject | string;
  /** A reference to an attached document that is external to the document(s) being exchanged */
  externalReference?: ExternalReference;
};

class Attachment extends GenericAggregateComponent {
  /**
   *
   * @param content children nodes
   */
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:Attachment');
  }
}

export { Attachment, AllowedParams as AttachmentParams };
