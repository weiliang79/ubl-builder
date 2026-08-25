import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import { loadSchema, Schema, SchemaChild } from './schema';

/**
 * Corrects the params maps in place from the OASIS schemas.
 *
 * This is deliberately a *correcting* pass rather than a wholesale emitter.
 * It rewrites the element name, minOccurs and maxOccurs of entries that
 * already exist, and leaves everything else — the classRef, the class body,
 * the exports — untouched. Adding the elements the fork never transcribed
 * needs import management and 18 component types that do not exist yet; that
 * is a separate job.
 */

const CAC_DIR = join(__dirname, '..', '..', 'src', 'cac');

interface Entry {
  raw: string;
  /** Offsets of this entry within the params-map body, for in-place splicing. */
  start: number;
  end: number;
  key: string;
  name: string;
  order: string;
  min: string;
  max: string;
  classRef: string;
}

/**
 * Read the params map by tracking brace depth.
 *
 * Prettier wraps longer entries across several lines, so a line-oriented
 * parser sees only a third of the files.
 */
function readEntries(source: string): { entries: Entry[]; bodyStart: number; bodyEnd: number } | null {
  const open = /const ParamsMap[^=]*=\s*\{/.exec(source);
  if (!open) return null;

  const bodyStart = (open.index as number) + open[0].length;
  let depth = 1;
  let i = bodyStart;
  for (; i < source.length && depth > 0; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
  }
  const bodyEnd = i - 1;
  const body = source.slice(bodyStart, bodyEnd);

  const entries: Entry[] = [];
  let cursor = 0;
  while (cursor < body.length) {
    const keyMatch = /(\w+):\s*\{/.exec(body.slice(cursor));
    if (!keyMatch) break;
    const entryStart = cursor + (keyMatch.index as number);
    let d = 0;
    let j = entryStart + keyMatch[0].length - 1;
    for (; j < body.length; j += 1) {
      if (body[j] === '{') d += 1;
      else if (body[j] === '}') {
        d -= 1;
        if (d === 0) break;
      }
    }
    const raw = body.slice(entryStart, j + 1);
    const field = (name: string) => new RegExp(`${name}:\\s*([^,}]+)`).exec(raw)?.[1].trim() ?? '';
    entries.push({
      raw,
      start: entryStart,
      end: j + 1,
      key: keyMatch[1],
      name: /attributeName:\s*'([^']*)'/.exec(raw)?.[1] ?? '',
      order: field('order'),
      min: field('min'),
      max: field('max') || 'undefined',
      classRef: field('classRef'),
    });
    cursor = j + 1;
  }
  return entries.length ? { entries, bodyStart, bodyEnd } : null;
}

const local = (name: string) => name.trim().split(':').pop() as string;
const capitalize = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

/**
 * Pair a hand-written entry with its schema child.
 *
 * Exact name first, then the local name case-insensitively — which recovers
 * the wrong-prefix, wrong-case and trailing-space defects — then the TS key,
 * which recovers entries whose element name was written as a type name.
 */
function matchChild(entry: Entry, children: SchemaChild[], taken: Set<string>): SchemaChild | undefined {
  const free = children.filter((c) => !taken.has(c.name));
  const byExact = free.find((c) => c.name === entry.name);
  if (byExact) return byExact;

  const wanted = local(entry.name).toLowerCase();
  const byLocal = free.find((c) => local(c.name).toLowerCase() === wanted);
  if (byLocal) return byLocal;

  const byKey = free.find((c) => local(c.name) === capitalize(entry.key));
  return byKey;
}

function schemaTypeFor(stem: string, schema: Schema) {
  const viaElement = schema.elements.get(`cac:${stem}`);
  return (
    (viaElement ? schema.types.get(viaElement) : undefined) ??
    schema.types.get(`cac:${stem}Type`) ??
    schema.types.get(`doc:${stem}Type`)
  );
}

function main(): void {
  const schema = loadSchema();
  const write = !process.argv.includes('--check');
  let corrected = 0;
  let filesChanged = 0;
  const skipped: string[] = [];

  readdirSync(CAC_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .forEach((file) => {
      const path = join(CAC_DIR, file);
      const source = readFileSync(path, 'utf8');
      const parsed = readEntries(source);
      const type = schemaTypeFor(basename(file, '.ts'), schema);

      if (!parsed || !type) {
        if (type) skipped.push(file);
        return;
      }

      const taken = new Set<string>();
      const changes: string[] = [];
      const edits: { start: number; end: number; text: string }[] = [];

      parsed.entries.forEach((entry) => {
        const child = matchChild(entry, type.children, taken);
        if (!child) return;
        taken.add(child.name);

        const min = String(child.minOccurs);
        const max = child.maxOccurs === null ? 'undefined' : String(child.maxOccurs);
        const order = String(type.children.indexOf(child) + 1);

        if (entry.name !== child.name) changes.push(`${entry.key}: name '${entry.name}' -> '${child.name}'`);
        if (entry.min !== min) changes.push(`${entry.key}: min ${entry.min} -> ${min}`);
        if (entry.max !== max) changes.push(`${entry.key}: max ${entry.max} -> ${max}`);

        // Surgical field replacement: everything else in the entry, and every
        // comment between entries, is left exactly as written.
        const text = entry.raw
          .replace(/order:\s*\d+/, `order: ${order}`)
          .replace(/attributeName:\s*'[^']*'/, `attributeName: '${child.name}'`)
          .replace(/min:\s*\d+/, `min: ${min}`)
          .replace(/max:\s*(?:\d+|undefined)/, `max: ${max}`);
        edits.push({ start: entry.start, end: entry.end, text });
      });

      if (changes.length === 0) return;
      corrected += changes.length;
      filesChanged += 1;
      console.log(`\n${file}`);
      changes.forEach((c) => console.log(`    ${c}`));
      const body = source.slice(parsed.bodyStart, parsed.bodyEnd);
      let rebuiltBody = '';
      let cursor = 0;
      edits.forEach((edit) => {
        rebuiltBody += body.slice(cursor, edit.start) + edit.text;
        cursor = edit.end;
      });
      rebuiltBody += body.slice(cursor);

      if (write) writeFileSync(path, source.slice(0, parsed.bodyStart) + rebuiltBody + source.slice(parsed.bodyEnd));
    });

  console.log(`\n${'='.repeat(64)}`);
  console.log(`${write ? 'corrected' : 'would correct'} ${corrected} entries across ${filesChanged} files`);
  if (skipped.length) {
    console.log(`\nnot machine-editable (multi-line entries), left alone:\n  ${skipped.join(', ')}`);
  }
  if (!write && corrected > 0) process.exitCode = 1;
}

main();
