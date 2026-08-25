import { Invoice } from '../../documents';
import { Profile } from '../Profile';

/**
 * Malaysia — LHDN MyInvois.
 *
 * Built on plain UBL 2.1. MyInvois uses neither `cbc:UBLVersionID`,
 * `cbc:CustomizationID` nor `cbc:ProfileID` — verified against the LHDN SDK —
 * carrying its version in `cbc:InvoiceTypeCode/@listVersionID` instead, which
 * the caller sets per document. So `defaults()` only declares namespaces.
 */
export const myInvois: Profile = {
  id: 'myinvois@1.0',

  defaults(document: Invoice): void {
    document
      .addProperty('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')
      .addProperty('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
      .addProperty('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
  },

  /**
   * A no-op at document version 1.0, which LHDN accepts unsigned.
   *
   * Version 1.1 enables signature validation and needs XAdES: canonicalise
   * with xml-c14n11 excluding UBLExtensions and Signature, digest with
   * SHA-256, sign with a certificate from an MCMC-approved Malaysian CA, and
   * assemble the result into the standard UBL signature extension. That is
   * tracked for 0.2.0.
   */
  finalize(): void {
    return;
  },
};
