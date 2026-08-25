import { Invoice } from '../documents';

/**
 * A jurisdiction's rules, layered over a plain UBL document.
 *
 * The core models UBL 2.1 and nothing else. Everything a country adds sits
 * behind this interface: namespace and identifier defaults, its code lists,
 * and any derived values it requires. A profile is deliberately data and hooks
 * rather than a document subclass — MyInvois alone has four document types
 * plus four self-billed variants, and subclassing would multiply them out.
 */
export interface Profile {
  /** Stable identifier, e.g. `myinvois@1.0`. */
  readonly id: string;

  /**
   * Stamp whatever the jurisdiction expects on every document: namespace
   * declarations, and identifiers such as Peppol's CustomizationID.
   *
   * MyInvois needs none of the latter — it carries its version in
   * `cbc:InvoiceTypeCode/@listVersionID` instead — so its implementation only
   * declares namespaces.
   */
  defaults?(document: Invoice): void;

  /**
   * Derive whatever the jurisdiction computes from the finished document:
   * DIAN's CUFE and QR code, MyInvois's XAdES signature.
   *
   * Asynchronous because signing may reach a smartcard, an HSM or a cloud KMS.
   * A private key never enters this library; the caller supplies a signer.
   */
  finalize?(document: Invoice): void | Promise<void>;
}
