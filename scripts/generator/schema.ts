import { DOMParser } from '@xmldom/xmldom';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Reads the OASIS UBL 2.1 schemas into a model the generator can emit from.
 *
 * The schemas are regular enough that this needs no XSD machinery: every
 * aggregate is an xsd:sequence of xsd:element refs, and every basic component
 * is a simpleContent extension of an unqualified datatype. Walking the DOM by
 * tag name is sufficient and far easier to follow than XPath with namespaces.
 */

export const SCHEMA_ROOT = join(__dirname, '..', '..', 'schemas', 'ubl', '2.1');

export interface SchemaChild {
  /** Qualified element name as it appears in a document, e.g. `cbc:ID`. */
  name: string;
  minOccurs: number;
  /** `null` means unbounded. */
  maxOccurs: number | null;
  /** Resolved type, e.g. `udt:IdentifierType` or `cac:AddressType`. */
  type: string;
  /** The ccts:Definition carried by the element ref, for generated docs. */
  definition: string;
}

export interface SchemaType {
  /** Complex type name, e.g. `TaxSchemeType`. */
  name: string;
  children: SchemaChild[];
}

export interface Schema {
  /** Aggregate complex types, keyed by name. */
  types: Map<string, SchemaType>;
  /** Qualified element name -> the type it declares, e.g. `cbc:ID` -> `cbc:IDType`. */
  elements: Map<string, string>;
  /** Basic component type -> the udt type it extends, e.g. `cbc:IDType` -> `udt:IdentifierType`. */
  basicTypes: Map<string, string>;
}

function parse(file: string): Document {
  return new DOMParser().parseFromString(readFileSync(join(SCHEMA_ROOT, file), 'utf8'), 'text/xml') as never;
}

function children(node: Element, tag: string): Element[] {
  return Array.from(node.getElementsByTagName(tag));
}

/** Qualify an unprefixed name against the module it was declared in. */
function qualify(name: string, prefix: string): string {
  return name.includes(':') ? name : `${prefix}:${name}`;
}

function readElementDeclarations(doc: Document, prefix: string, into: Map<string, string>): void {
  children(doc.documentElement as never, 'xsd:element')
    .filter((el) => el.getAttribute('name') && el.getAttribute('type'))
    // top-level declarations only; nested ones are refs inside a sequence
    .filter((el) => el.parentNode === doc.documentElement)
    .forEach((el) => {
      into.set(`${prefix}:${el.getAttribute('name')}`, qualify(el.getAttribute('type') as string, prefix));
    });
}

function readComplexTypes(doc: Document, prefix: string, into: Map<string, SchemaType>): void {
  children(doc.documentElement as never, 'xsd:complexType')
    .filter((ct) => ct.getAttribute('name'))
    .forEach((ct) => {
      const sequence = children(ct, 'xsd:sequence')[0];
      if (!sequence) return; // simpleContent — a basic component, handled separately

      const kids = children(sequence, 'xsd:element')
        .filter((el) => el.getAttribute('ref'))
        .map((el) => {
          const ref = el.getAttribute('ref') as string;
          const max = el.getAttribute('maxOccurs');
          const definition = children(el, 'ccts:Definition')[0];
          return {
            name: ref,
            minOccurs: Number(el.getAttribute('minOccurs') ?? '1'),
            maxOccurs: max === 'unbounded' ? null : Number(max ?? '1'),
            type: '', // resolved once every module is loaded
            definition: (definition?.textContent ?? '').replace(/\s+/g, ' ').trim(),
          };
        });

      into.set(qualify(ct.getAttribute('name') as string, prefix), {
        name: ct.getAttribute('name') as string,
        children: kids,
      });
    });
}

function readBasicTypes(doc: Document, prefix: string, into: Map<string, string>): void {
  children(doc.documentElement as never, 'xsd:complexType')
    .filter((ct) => ct.getAttribute('name'))
    .forEach((ct) => {
      const extension = children(ct, 'xsd:extension')[0];
      if (!extension) return;
      into.set(qualify(ct.getAttribute('name') as string, prefix), extension.getAttribute('base') as string);
    });
}

export function loadSchema(): Schema {
  const modules: [string, string][] = [
    ['common/UBL-CommonAggregateComponents-2.1.xsd', 'cac'],
    ['common/UBL-CommonBasicComponents-2.1.xsd', 'cbc'],
    ['common/UBL-CommonExtensionComponents-2.1.xsd', 'ext'],
    ['common/UBL-CommonSignatureComponents-2.1.xsd', 'sig'],
    ['common/UBL-SignatureAggregateComponents-2.1.xsd', 'sac'],
    ['common/UBL-SignatureBasicComponents-2.1.xsd', 'sbc'],
    ['maindoc/UBL-Invoice-2.1.xsd', 'doc'],
  ];

  const types = new Map<string, SchemaType>();
  const elements = new Map<string, string>();
  const basicTypes = new Map<string, string>();

  modules.forEach(([file, prefix]) => {
    const doc = parse(file);
    readElementDeclarations(doc, prefix, elements);
    readComplexTypes(doc, prefix, types);
    readBasicTypes(doc, prefix, basicTypes);
  });

  // Resolve each child's element ref to the type it carries.
  types.forEach((type) => {
    type.children.forEach((child) => {
      const declared = elements.get(child.name);
      child.type = declared ? (basicTypes.get(declared) ?? declared) : '';
    });
  });

  return { types, elements, basicTypes };
}
