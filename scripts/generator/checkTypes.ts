import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Every params-map entry must have a matching field on AllowedParams.
 *
 * check:schema holds the map to the OASIS schemas, but nothing held the
 * TypeScript type beside it to the map — so a field could exist in the map and
 * be unusable, which is what happened to the six BillingReference entries
 * revived in step 6.
 */

const CAC_DIR = join(__dirname, '..', '..', 'src', 'cac');

function body(source: string, start: number): string {
  let depth = 1;
  let i = start;
  for (; i < source.length && depth > 0; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
  }
  return source.slice(start, i - 1);
}

let checked = 0;
const problems: string[] = [];

readdirSync(CAC_DIR)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .forEach((file) => {
    const source = readFileSync(join(CAC_DIR, file), 'utf8');
    const map = /const ParamsMap[^=]*=\s*\{/.exec(source);
    const params = /type AllowedParams\s*=\s*\{/.exec(source);
    if (!map || !params) return;

    checked += 1;
    const mapKeys = [...body(source, map.index + map[0].length).matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]);
    const typeKeys = new Set(
      [...body(source, params.index + params[0].length).matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1]),
    );

    mapKeys
      .filter((key) => !typeKeys.has(key))
      .forEach((key) => problems.push(`${file}: '${key}' is in the params map but not in AllowedParams`));
  });

console.log(`checked ${checked} components`);
if (problems.length) {
  problems.forEach((p) => console.log(`  ${p}`));
  console.log(`\n${problems.length} field(s) unreachable from the public type`);
  process.exitCode = 1;
} else {
  console.log('every params-map entry is reachable from AllowedParams');
}
