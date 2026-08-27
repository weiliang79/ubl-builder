import { Invoice } from '../../documents';
import { Profile } from '../Profile';

/**
 * Colombia — DIAN.
 *
 * Retained unmaintained as the second data point for the profile seam: DIAN is
 * extension-heavy where MyInvois is extension-light, so between them they span
 * the ways a jurisdiction bends UBL. Designing a plugin boundary against a
 * single implementation reliably produces the wrong boundary.
 *
 * `finalize()` is unimplemented. What it needs — CUFE, the QR code and the
 * DIAN extension — is written up in CUFE.md.
 */
export const dian = {
  id: 'dian@2.1',

  defaults(document: Invoice): void {
    document
      .addProperty('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')
      .addProperty('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
      .addProperty('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
      .addProperty('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
      // DIAN's own structures; this is the namespace that used to be hardcoded
      // into the core document's setDefaultProperties.
      .addProperty('xmlns:sts', 'http://www.dian.gov.co/contratos/facturaelectronica/v1/Structures');
  },
} satisfies Profile;
