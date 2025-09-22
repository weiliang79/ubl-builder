import GenericAggregateComponent, { IGenericKeyValue, ParamsMapValues } from './GenericAggregateComponent';
import { AdditionalDocumentReference, InvoiceDocumentReference } from './DocumentReferenceGroup';

const ParamsMap: IGenericKeyValue<ParamsMapValues> = {
  invoiceDocumentReference: {
    order: 1,
    attributeName: 'cac:InvoiceDocumentReference',
    min: 0,
    max: 1,
    classRef: InvoiceDocumentReference,
  },
  selfBilledInvoiceDocumentReference: {
    order: 2,
    attributeName: 'cac:SelfBilledInvoiceDocumentReference',
    min: 0,
    max: 1,
    classRef: null,
  },
  creditNoteDocumentReference: {
    order: 3,
    attributeName: 'cac:CreditNoteDocumentReference',
    min: 0,
    max: 1,
    classRef: null,
  },
  selfBilledCreditNoteDocumentReference: {
    order: 4,
    attributeName: 'cac:SelfBilledCreditNoteDocumentReference',
    min: 0,
    max: 1,
    classRef: null,
  },
  debitNoteDocumentReference: {
    order: 5,
    attributeName: 'cac:DebitNoteDocumentReference',
    min: 0,
    max: 1,
    classRef: null,
  },
  reminderDocumentReference: {
    order: 6,
    attributeName: 'cac:ReminderDocumentReference',
    min: 0,
    max: 1,
    classRef: null,
  },
  additionalDocumentReference: {
    order: 7,
    attributeName: 'cac:AdditionalDocumentReference',
    min: 0,
    max: 1,
    classRef: AdditionalDocumentReference,
  },
  billingReferenceLine: { order: 8, attributeName: 'cac:BillingReferenceLine', min: 0, max: undefined, classRef: null },
};

type AllowedParams = {
  /** A reference to an invoice */
  invoiceDocumentReference?: InvoiceDocumentReference;

  // /** A reference to a self-billed invoice */
  // selfBilledInvoiceDocumentReference: null;

  // /** A reference to a credit note */
  // creditNoteDocumentReference: null;

  // /** A reference to a self-billed credit note */
  // selfBilledCreditNoteDocumentReference: null;

  // /** A reference to a debit note */
  // debitNoteDocumentReference: null;

  // /** A reference to a reminder */
  // reminderDocumentReference: null;

  /** A reference to an additional document */
  additionalDocumentReference?: AdditionalDocumentReference;

  // /** A reference to a billing document */
  // billingReferenceLine: null;
};

/**
 * A class to define a reference to a billing document
 * More info http://www.datypic.com/sc/ubl21/e-cac_BillingReference.html
 */
class BillingReference extends GenericAggregateComponent {
  constructor(content: AllowedParams) {
    super(content, ParamsMap, 'cac:BillingReference');
  }

  /**
   *
   * @param value
   */
  setInvoiceDocumentReference(value: InvoiceDocumentReference) {
    if (value instanceof InvoiceDocumentReference) {
      this.attributes.invoiceDocumentReference = value;
    } else {
      throw new Error('this action is not suported yet');
    }

    return this;
  }

  /**
   *
   * @param value
   */
  setAdditionalDocumentReference(value: AdditionalDocumentReference) {
    if (value instanceof AdditionalDocumentReference) {
      this.attributes.additionalDocumentReference = value;
    } else {
      throw new Error('this action is not suported yet');
    }

    return this;
  }
}

export { BillingReference, AllowedParams as BillingReferenceParams };
