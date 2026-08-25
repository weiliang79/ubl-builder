# Migrating to 0.1.0

0.1.0 restructures the package. The document model is unchanged — XML output
is byte-for-byte identical, verified against a fixture built from a production
invoice LHDN accepted — but every import path moves, and a few signatures
change.

## Import paths

`dist/` is no longer reachable. The package now declares subpath exports, so
imports name what they want rather than where it happens to be built.

| Before                                                                                 | After                               |
| -------------------------------------------------------------------------------------- | ----------------------------------- |
| `@weiliang79/ubl-builder/dist/ubl21/CommonAggregateComponents`                         | `@weiliang79/ubl-builder/cac`       |
| `@weiliang79/ubl-builder/dist/ubl21/CommonAggregateComponents/CommodityClassification` | `@weiliang79/ubl-builder/cac`       |
| `@weiliang79/ubl-builder/dist/ubl21/CommonAggregateComponents/ItemPriceExtension`      | `@weiliang79/ubl-builder/cac`       |
| `@weiliang79/ubl-builder/dist/ubl21/types/UnqualifiedDataTypes`                        | `@weiliang79/ubl-builder/datatypes` |
| `@weiliang79/ubl-builder/dist/ubl21/schemaDocuments`                                   | `@weiliang79/ubl-builder/documents` |
| `@weiliang79/ubl-builder/dist/ubl21/extensionComponents`                               | `@weiliang79/ubl-builder/ext`       |

The root import still works and now re-exports everything — 136 names rather
than 6, so components no longer need reaching for through `dist/`.

```ts
import { Invoice, Party, TaxScheme, UdtAmount } from '@weiliang79/ubl-builder';
```

## Signature changes

**`new Invoice(id)`** — the second `options` argument is gone. It carried DIAN
settings (`issuer`, `software`, `enviroment`) that had no business in a generic
document, and nothing read them. The `id` argument now works: it previously
was accepted and ignored, which is why the README's own example emitted an
empty document.

**`removeProperty(key)`** — took `(key, value)` and set the property instead of
removing it.

**`getHash()` is async** on the SHA classes in `profiles/dian`. They moved from
Node's `crypto` to Web Crypto so the package bundles for a browser, and Web
Crypto is promise-based. Nothing exported these before.

**`InvoiceOptions` is removed.** If you were passing DIAN configuration, that
belongs to a profile now — see `profiles/dian/CUFE.md`.

## Behaviour that changed on purpose

**Element names corrected in five components.** `Delivery.shipment`,
`DocumentReference.documentDescription`, `DocumentReference.validityPeriod`,
`ExternalReference.formatCode` and `TaxTotal.taxIncludedIndicator` emitted
names that exist in no UBL schema — wrong prefix, wrong case, or a stray
trailing space. If you relied on the malformed output, it is now correct.

**Cardinality corrected in 33 places** against the OASIS schemas. Some fields
that rejected arrays now accept them, and vice versa. `npm run check:schema`
keeps them honest.

**Five previously-dead entries now work.** Six `classRef` references were
broken by circular imports and threw `classRef is required`; five are fixed,
and the sixth is annotated as needing a component type that does not exist yet.

## New

- `Invoice.getJson()` renders OASIS UBL JSON v2.0, the format MyInvois accepts
  alongside XML.
- `profiles/myinvois` carries the LHDN vocabulary — tax type codes, document
  type codes, identification schemes, the `OTH` tax scheme.
- `getAsXml()` works on any component. It previously threw for anything with
  more than one child, and emitted unwrapped children for the rest.
