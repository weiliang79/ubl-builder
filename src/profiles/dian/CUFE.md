# DIAN: CUFE, QR code and the DIAN extension

Colombia's DIAN requires three derived values that plain UBL does not define.
They were carried in `Invoice.ts` as ~200 lines of commented-out code, which
is the wrong place for them twice over: they are country-specific, and
commented code is not an implementation.

They are recorded here until `profiles/dian` implements them for real. The
mechanism is the same `finalize()` hook MyInvois needs for XAdES, so whichever
lands first shapes the other.

## What CUFE is

A SHA-384 over a fixed concatenation of invoice fields, set as `cbc:UUID` with
`schemeName="CUFE-SHA384"`. The QR code hashes a validation URL containing it.

## The original implementation

```ts
  // applyCufeCode(): void {
  //   let paramsToEncode = '';

  //   const ivaTaxAmount = this.findTaxTotalById('01'); // Iva Tax
  //   const incTaxAmount = this.findTaxTotalById('04'); // INC Tax
  //   const icaTaxAmount = this.findTaxTotalById('03'); // ICA Tax

  //   const codeToHash =
  //     this.children.invoiceTypeCode.content === '03'
  //       ? this.options.software.pin // for contingency Invoice
  //       : this.options.issuer.technicalKey;

  //   // console.log({ ivaTaxAmount, incTaxAmount, icaTaxAmount });

  //   const mapToHash = [
  //     // Número de factura.(prefijo concatenado con el número de la factura).
  //     { name: 'NumFac', value: this.children.id.content },
  //     // Fecha de factura
  //     { name: 'FecFac', value: this.children.issueDate.content },
  //     // Hora de la factura incluyendo GMT
  //     { name: 'HorFac', value: this.children.issueTime.content },
  //     /* Valor de la Factura sin Impuestos, con punto decimal, con decimales a dos (2) dígitos, sin
  //       separadores de miles, ni símbolo pesos.
  //     */
  //     { name: 'Valor Bruto', value: this.children.legalMonetaryTotal.getLineExtensionAmount() },
  //     // 01 Este valor es fijo
  //     { name: 'CodImp1', value: '01' },
  //     /* Valor impuesto 01 - IVA, con punto decimal, con decimales a dos (2) dígitos, sin separadores
  //       de miles, ni símbolo pesos. Si no esta referenciado el impuesto 01 – IVA este valor se
  //       representa con 0.00
  //     */
  //     { name: 'Valor Impuesto 1', value: ivaTaxAmount },
  //     // 04 Este valor es fijo.
  //     { name: 'CodImp2', value: '04' },
  //     /* Valor impuesto 04 - Impuesto Nacional al Consumo, con punto decimal, con decimales a dos
  //       (2) dígitos, sin separadores de miles, ni símbolo pesos. Si no esta referenciado el impuesto
  //       04- INC este valor se representa con 0.00
  //     */
  //     { name: 'ValImp2', value: incTaxAmount },
  //     // 03 Este valor es fijo.
  //     { name: 'CodImp3', value: '03' },
  //     /* Valor impuesto 03 - ICA, con punto decimal, con decimales a dos (2) dígitos, sin separadores
  //       de miles, ni símbolo pesos. Si no esta referenciado el impuesto 03 - ICA este valor se
  //       representa con 0.00 */
  //     { name: 'ValImp3', value: icaTaxAmount }, // todo
  //     /* Valor Total, con punto decimal, con decimales a dos (2) dígitos, sin separadores de miles, ni
  //       símbolo pesos
  //       /Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount/>
  //     */
  //     { name: 'ValTot', value: this.children.legalMonetaryTotal.getPayableAmount() },
  //     /* NIT del Facturador Electrónico sin puntos ni guiones, sin digito de verificación.
  //       /Invoice/ cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID/>
  //     */
  //     { name: 'NitFE', value: this.children.accountingSupplierParty.getParty().getTaxSchemes()[0].getCompanyID() },
  //     /*
  //       Número de identificación del adquirente sin puntos ni guiones, sin digito de verificación.
  //       /Invoice/ cac:AccountingCustomerParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID/>
  //     */
  //     { name: 'NumAdq', value: this.children.accountingCustomerParty.getParty().getTaxSchemes()[0].getCompanyID() },
  //     /*
  //       La clave técnica se encuentra en la consultar del rango de numeración que se hacer a
  //       trevés del Web Service, la cual no esta expuesto dentro del XML
  //       Clave técnica del rango de facturación.
  //     */
  //     { name: 'ClTec', value: codeToHash },
  //     /* Número de identificación del ambiente utilizado por el contribuyente para emitir la factura
  //       validar el numeral 6.1.1.
  //     */
  //     { name: 'TipoAmbiente', value: this.options.enviroment }, // 1: produccion, 2: pruebas
  //   ];

  //   paramsToEncode = mapToHash.map((item) => item.value).join('');
  //   // console.log("Composicion del CUFE => ", paramsToEncode);
  //   const CUFE = new SHA384().getHash(paramsToEncode, 'binary', 'hex');
  //   this.setUUID(CUFE, { schemeName: 'CUFE-SHA384', schemeID: this.options.enviroment });
  // }

  // applyQRCode(): void {
  //   const CUFE = this.children.uuid.content;
  //   const stringToHash = `https://catalogovpfe.dian.gov.co/document/searchqr?documentkey=${CUFE}`;
  //   const QRCode = new SHA384().getHash(stringToHash, 'binary', 'hex');
  //   this.children.UBLExtensions.getDianUblExtension()
  //     .getExtensionContent()
  //     .getDianExtensionsContent()
  //     .setQRCode(QRCode);
  //   // console.log("QRCode CALCULADO ==> ", QRCode);
  // }

  /**
   * @returns {Invoice}
   */
  // finalizeDocument(): Invoice {
  //   // updaye the LineCountNumeric
  //   this.setLineCountNumeric(this.children.invoiceLines.length);
  //   // give id for each invoiceLine
  //   this.children.invoiceLines.forEach((invoiceLine: InvoiceLine, index: number) => {
  //     invoiceLine.setId((index + 1).toString());
  //   });

  //   // Calculate and set CUFE
  //   this.applyCufeCode();
  //   // Calculate and set QRCode
  //   this.applyQRCode();

  //   return this;
  // }

  // calculateDianExtension() {
  //   const softwareProvider = this.options.software;
  //   const issuer = this.options.issuer;

  //   const softwareSecurityCodeHashed = new SHA384().getHash(
  //     softwareProvider.id + softwareProvider.pin + this.children.id.content,
  //     'binary',
  //     'hex',
  //   );

  //   const extensionsNode = new UBLExtensions();

  //   extensionsNode.addUBLExtension(
  //     new UBLExtensionType({
  //       extensionContent: new DianExtensions({
  //         dianExtensions: new DianExtensionsContent({
  //           invoiceControl: new InvoiceControl({
  //             invoiceAuthorization: issuer.resolutionNumber,
  //             authorizationPeriod: new PeriodType({
  //               startDate: issuer.startDate,
  //               endDate: issuer.endDate,
  //             }),
  //             authorizedInvoices: new AuthorizedInvoices({
  //               prefix: issuer.prefix,
  //               from: issuer.startRange,
  //               to: issuer.endRange,
  //             }),
  //           }),
  //           invoiceSource: new InvoiceSource({
  //             identificationCode: {
  //               content: 'CO',
  //               attributes: {
  //                 listAgencyID: '6',
  //                 listAgencyName: 'United Nations Economic Commission for Europe',
  //                 listSchemeURI: 'urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1',
  //               },
  //             },
  //           }),
  //           softwareProvider: new SoftwareProvider({
  //             // NIT del proveedor tecnologico
  //             providerID: new UdtIdentifier(softwareProvider.providerNit, {
  //               schemeAgencyID: '195',
  //               schemeAgencyName: 'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
  //               schemeID: '9', // Codigo de verificacion del NIT
  //               schemeName: '31', // indica que el tipo de documento es NIT
  //             }),
  //             // Id del software
  //             softwareID: new UdtIdentifier(softwareProvider.id, {
  //               schemeAgencyID: '195',
  //               schemeAgencyName: 'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
  //             }),
  //           }),
  //           softwareSecurityCode: new UdtIdentifier(softwareSecurityCodeHashed, {
  //             schemeAgencyID: '195',
  //             schemeAgencyName: 'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
  //           }),
  //           authorizationProvider: new AuthorizationProvider({
  //             // NIT de la DIAN
  //             authorizationProviderID: new UdtIdentifier('800197268', {
  //               schemeAgencyID: '195',
  //               schemeAgencyName: 'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
  //               schemeID: '4',
  //               schemeName: '31',
  //             }),
  //           }),
  //         }),
  //       }),
  //     }),
  //   );

  //   this.setUBLExtensions(extensionsNode);
  // }

  // getQRCode() {
  //   return (
  //     this.children.UBLExtensions.getDianUblExtension().getExtensionContent().getDianExtensionsContent().getQRCode() ||
  //     null
  //   );
  // }

```
