interface IGenericKeyValue<T> {
  [id: string]: T;
}

type SchemaDocumentChild = {
  order: number;
  childName: string;
  max?: number;
};

export const INVOICE_CHILDREN_MAP: IGenericKeyValue<SchemaDocumentChild> = {
  UBLExtensions: { order: 1, childName: 'ext:UBLExtensions', max: 1 },
  UBLVersionID: { order: 2, childName: 'cbc:UBLVersionID', max: 1 },
  customizationID: { order: 3, childName: 'cbc:CustomizationID', max: 1 },
  profileID: { order: 4, childName: 'cbc:ProfileID', max: 1 },
  profileExecutionID: { order: 5, childName: 'cbc:ProfileExecutionID', max: 1 },
  id: { order: 6, childName: 'cbc:ID', max: 1 },
  copyIndicator: { order: 7, childName: 'cbc:CopyIndicator', max: 1 },
  uuid: { order: 8, childName: 'cbc:UUID', max: 1 },
  issueDate: { order: 9, childName: 'cbc:IssueDate', max: 1 },
  issueTime: { order: 10, childName: 'cbc:IssueTime', max: 1 },
  dueDate: { order: 11, childName: 'cbc:DueDate', max: 1 },
  invoiceTypeCode: { order: 12, childName: 'cbc:InvoiceTypeCode', max: 1 },
  notes: { order: 13, childName: 'cbc:Note' },
  taxPointDate: { order: 14, childName: 'cbc:TaxPointDate', max: 1 },
  documentCurrencyCode: { order: 15, childName: 'cbc:DocumentCurrencyCode', max: 1 },
  taxCurrencyCode: { order: 16, childName: 'cbc:TaxCurrencyCode', max: 1 },
  pricingCurrencyCode: { order: 17, childName: 'cbc:PricingCurrencyCode', max: 1 },
  paymentCurrencyCode: { order: 18, childName: 'cbc:PaymentCurrencyCode', max: 1 },
  paymentAlternativeCurrencyCode: {
    order: 19,
    childName: 'cbc:PaymentAlternativeCurrencyCode',
    max: 1,
  },
  accountingCostCode: { order: 20, childName: 'cbc:AccountingCostCode', max: 1 },
  accountingCost: { order: 21, childName: 'cbc:AccountingCost', max: 1 },
  lineCountNumeric: { order: 22, childName: 'cbc:LineCountNumeric', max: 1 },
  buyerReference: { order: 23, childName: 'cbc:BuyerReference', max: 1 },
  invoicePeriods: { order: 24, childName: 'cac:InvoicePeriod' },
  orderReference: { order: 25, childName: 'cac:OrderReference', max: 1 },
  billingReferences: { order: 26, childName: 'cac:BillingReference' },
  despatchDocumentReferences: {
    order: 27,
    childName: 'cac:DespatchDocumentReference',
  },
  receiptDocumentReferences: {
    order: 28,
    childName: 'cac:ReceiptDocumentReference',
  },
  statementDocumentReferences: {
    order: 29,
    childName: 'cac:StatementDocumentReference',
  },
  originatorDocumentReferences: {
    order: 30,
    childName: 'cac:OriginatorDocumentReference',
  },
  contractDocumentReferences: {
    order: 31,
    childName: 'cac:ContractDocumentReference',
  },
  additionalDocumentReferences: {
    order: 32,
    childName: 'cac:AdditionalDocumentReference',
  },
  projectReferences: { order: 33, childName: 'cac:ProjectReference' },
  signatures: { order: 34, childName: 'cac:Signature' },
  accountingSupplierParty: { order: 35, childName: 'cac:AccountingSupplierParty', max: 1 },
  accountingCustomerParty: { order: 36, childName: 'cac:AccountingCustomerParty', max: 1 },
  payeeParty: { order: 37, childName: 'cac:PayeeParty', max: 1 },
  buyerCustomerParty: { order: 38, childName: 'cac:BuyerCustomerParty', max: 1 },
  sellerSupplierParty: { order: 39, childName: 'cac:SellerSupplierParty', max: 1 },
  taxRepresentativeParty: { order: 40, childName: 'cac:TaxRepresentativeParty', max: 1 },
  deliveries: { order: 41, childName: 'cac:Delivery' },
  deliveryTerms: { order: 42, childName: 'cac:DeliveryTerms', max: 1 },
  paymentMeans: { order: 43, childName: 'cac:PaymentMeans' },
  paymentTerms: { order: 44, childName: 'cac:PaymentTerms' },
  prepaidPayments: { order: 45, childName: 'cac:PrepaidPayment' },
  allowanceCharges: { order: 46, childName: 'cac:AllowanceCharge' },
  taxExchangeRate: { order: 47, childName: 'cac:TaxExchangeRate', max: 1 },
  pricingExchangeRate: { order: 48, childName: 'cac:PricingExchangeRate', max: 1 },
  paymentExchangeRate: { order: 49, childName: 'cac:PaymentExchangeRate', max: 1 },
  paymentAlternativeExchangeRate: {
    order: 50,
    childName: 'cac:PaymentAlternativeExchangeRate',
    max: 1,
  },
  taxTotals: { order: 51, childName: 'cac:TaxTotal' },
  withholdingTaxTotals: { order: 52, childName: 'cac:WithholdingTaxTotal' },
  legalMonetaryTotal: { order: 53, childName: 'cac:LegalMonetaryTotal', max: 1 },
  invoiceLines: { order: 54, childName: 'cac:InvoiceLine', max: undefined },
};
