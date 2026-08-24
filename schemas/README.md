# UBL 2.1 schemas

OASIS Universal Business Language (UBL) **2.1 OS** (OASIS Standard), retrieved
from <https://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/> on 2026-08-25.

These files are unmodified and retain their original OASIS copyright notices.
They are redistributed under the OASIS IPR Policy. They are **not** published to
npm — `package.json` ships `dist/**/*` only.

## What they are for

| Use | Introduced |
|---|---|
| Validating golden fixtures (`npm run validate:xsd`) | now |
| Input to the CAC/UDT code generator | step 6 |
| Signature components for XAdES support | 0.2.0 |

## Revision

Every file is the OS (final standard) revision, not a public review draft.
This matters: a draft revision of `UBL-CommonSignatureComponents-2.1.xsd`
differs from the standard, and drafts may omit imports.

## Validation scope

Structural only — element sequence, names, cardinality, datatypes.

**Not** EN 16931 Schematron. MyInvois deviates from BR-CO-13: it reports
line-level discounts in `AllowanceTotalAmount` while `LineExtensionAmount` is
already net of them, so business-rule validation rejects conformant documents.
See D8 in the restructure decision record.
