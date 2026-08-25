import { create } from 'xmlbuilder2';
import { XmlContent, XmlNode } from './xmlNode';

/**
 * The only place that knows a serialization dialect.
 *
 * Everything above this file speaks XmlNode; xmlbuilder2 appears here and
 * nowhere else.
 */

export interface XmlOptions {
  /** Pretty-print the output. */
  pretty?: boolean;
  /** Omit the XML declaration. */
  headless?: boolean;
}

/**
 * Convert a node tree to xmlbuilder2's object dialect: `#` carries text,
 * `@` prefixes attributes, and repeated element names become arrays.
 *
 * Repeated names are grouped rather than interleaved, which is safe because
 * UBL complex types are xsd:sequence — elements sharing a name are always
 * contiguous.
 */
export function toXmlObject(content: XmlContent): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (content.value !== undefined && content.value !== null) {
    out['#'] = content.value;
  }

  Object.entries(content.attributes ?? {})
    .filter(([, value]) => value)
    .forEach(([name, value]) => {
      out[`@${name}`] = value;
    });

  (content.children ?? []).forEach((child) => {
    const converted = toXmlObject(child);
    if (child.name in out) {
      const existing = out[child.name];
      out[child.name] = Array.isArray(existing) ? [...existing, converted] : [existing, converted];
    } else {
      out[child.name] = child.repeats ? [converted] : converted;
    }
  });

  return out;
}

/** Render a named node as an XML document. */
export function toXmlString(node: XmlNode, { pretty = false, headless = false }: XmlOptions = {}): string {
  const document = { [node.name]: toXmlObject(node) };

  return create({ version: '1.0', encoding: 'UTF-8', standalone: false }, document).end({
    headless,
    prettyPrint: pretty,
  });
}
