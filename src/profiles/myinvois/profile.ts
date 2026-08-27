import { Invoice } from '../../documents';
import { Profile } from '../Profile';

/**
 * Malaysia — LHDN MyInvois.
 *
 * Built on plain UBL 2.1. MyInvois uses neither `cbc:UBLVersionID`,
 * `cbc:CustomizationID` nor `cbc:ProfileID` — verified against the LHDN SDK —
 * carrying its version in `cbc:InvoiceTypeCode/@listVersionID` instead, which
 * the caller sets per document. So `defaults()` only declares namespaces.
 *
 * ## Monetary totals deviate from EN 16931 — do not "fix" them
 *
 * MyInvois reports line-level discounts in `cbc:AllowanceTotalAmount` even
 * though each line's `cbc:LineExtensionAmount` is already net of them. Two
 * production invoices confirm it — one authored in the LHDN portal, one
 * submitted by API — with identical totals:
 *
 * ```
 * line subtotals        90.00 + 100.00 + 70.00 = 260.00
 * LineExtensionAmount   90.00      ("Total Sales Amount")
 * AllowanceTotalAmount  170.00     ("Total Discount")
 * TaxExclusiveAmount    90.00
 * ```
 *
 * EN 16931 BR-CO-13 requires
 * `TaxExclusiveAmount = LineExtensionAmount - AllowanceTotalAmount +
 * ChargeTotalAmount`, which here yields `90 - 170 = -80` against a declared
 * 90. UBL scopes `AllowanceTotalAmount` to *document-level* allowances, since
 * line-level ones are already absorbed into each line; MyInvois treats it as
 * an informational total of all discounts, so the standard formula
 * double-counts them. The LHDN portal emits this itself, which makes it
 * authoritative rather than a client defect.
 *
 * Two consequences. Validate against the UBL XSD only — never EN 16931
 * Schematron, which rejects every conformant MyInvois document. And this
 * library neither computes nor checks monetary totals: the caller supplies
 * them, and LHDN is the arbiter. See D8 in the restructure decision record.
 */
export const myInvois = {
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
  finalize(_document: Invoice): void {
    return;
  },
} satisfies Profile;
