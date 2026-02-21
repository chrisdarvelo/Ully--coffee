'use strict';

/**
 * Custom Jest transformer for react-native/jest/ files.
 *
 * react-native@0.84 ships Jest infrastructure (.js files declared @flow strict)
 * that also uses TypeScript `as` type assertions. No single Babel parser can
 * handle both syntaxes. This transformer:
 *
 *  - For jest/mock.js: replaces the whole file with a plain-JS stub (the
 *    file uses both Flow generics AND TypeScript `as` in a way that no Babel
 *    config can parse cleanly).
 *
 *  - For all other jest/*.js / jest/mocks/*.js files: strips the TypeScript
 *    `as TypeName<...>` expressions so the remaining source is valid Flow and
 *    can be processed by the standard babel-jest + @react-native/babel-preset.
 */

const crypto = require('crypto');
const babelJest = require('babel-jest');
// babel-jest exports a factory; call createTransformer() to get the actual transformer.
const babelTransformerInstance = babelJest.createTransformer();

// ── Stub for jest/mock.js ────────────────────────────────────────────────────
// Plain-JS reimplementation of the type-safe mock() helper.
// setup.js calls: mock('m#../Libraries/Foo/Bar', 'm#./mocks/Bar')
// The 'm#' prefix is stripped to get the actual module specifier.
const MOCK_JS_STUB = `
'use strict';

function mock(moduleRef, factoryRef) {
  var ref = moduleRef.substring(2);
  if (factoryRef === undefined) {
    jest.mock(ref);
  } else {
    var mockFactory = factoryRef.substring(2);
    jest.mock(ref, function () { return jest.requireActual(mockFactory); });
  }
}

module.exports = mock;
module.exports.default = mock;
`;

// ── TypeScript `as` assertion stripper ───────────────────────────────────────
// Strips ` as TypeName` and ` as TypeName<…>` (with balanced nested generics).
// After stripping, the remaining Flow-annotated source is parseable by
// @babel/plugin-transform-flow-strip-types (used by @react-native/babel-preset).
function stripTypeAssertions(source) {
  let result = '';
  let i = 0;

  while (i < source.length) {
    const asIdx = source.indexOf(' as ', i);
    if (asIdx === -1) {
      result += source.slice(i);
      break;
    }

    // Verify what follows ' as ' is an identifier start (word char or $).
    const afterAs = asIdx + 4;
    if (afterAs >= source.length || !/[\w$]/.test(source[afterAs])) {
      // Not a type assertion — copy up to and including ' as ' and continue.
      result += source.slice(i, afterAs);
      i = afterAs;
      continue;
    }

    // Skip `import * as Name` — the `*` before ` as ` marks a namespace import.
    if (asIdx > 0 && source[asIdx - 1] === '*') {
      result += source.slice(i, afterAs);
      i = afterAs;
      continue;
    }

    // Skip `import { Foo as Bar }` — a `{` somewhere before (and a `,` or `{` right before).
    // Simple heuristic: if the char before ' as ' is a word char or `}` from a destructure,
    // AND we're inside an import { } block, skip. For robustness, also skip when preceded by
    // a bare identifier after `{` or `,` (export/import aliasing).
    // Check: if the previous non-space character is an identifier char AND the token before
    // that starts a { ... } import context. For simplicity, skip when preceded by exactly
    // an identifier (no parens, no closing brackets of expressions).
    // Pattern for real TS assertions we DO want to strip: `) as`, `> as`, `] as`, `} as` (object literal)
    // Pattern for import/export aliases we DON'T: `Foo as` (bare identifier after { or ,)
    // Heuristic: check if there's an opening brace context by looking for '{ ... as'.
    // Actually simplest: allow stripping only when the char before ' as ' is ) > ] or } at end of expr.
    // For { Foo as Bar }, the char before ' as ' is 'o' (identifier), so we check if it looks
    // like an import alias by scanning backward for '{' or ',' without crossing ')'.
    const beforeAs = source[asIdx - 1];
    if (/[\w$]/.test(beforeAs)) {
      // The character before ' as ' is an identifier char.
      // This could be: `ref as string` (TS assertion) or `Foo as Bar` (import alias).
      // Scan backward to determine context: if we find a '{' or ',' before a '(',
      // it's likely an import/export alias — skip stripping.
      let k = asIdx - 1;
      while (k >= i && /[\w$]/.test(source[k])) k--; // skip the identifier
      if (k >= i && (source[k] === ',' || source[k] === '{')) {
        // Inside an import/export destructure — skip
        result += source.slice(i, afterAs);
        i = afterAs;
        continue;
      }
    }

    // Skip identifier characters.
    let j = afterAs;
    while (j < source.length && /[\w$.]/.test(source[j])) j++;

    // Skip balanced generic type arguments if present.
    if (j < source.length && source[j] === '<') {
      let depth = 1;
      j++;
      while (j < source.length && depth > 0) {
        if (source[j] === '<') depth++;
        else if (source[j] === '>') depth--;
        j++;
      }
    }

    // Append everything before the ` as …` expression, skip the assertion.
    result += source.slice(i, asIdx);
    i = j;
  }

  return result;
}

// ── Transformer ──────────────────────────────────────────────────────────────
module.exports = {
  process(sourceText, sourcePath, options) {
    if (sourcePath.endsWith('react-native/jest/mock.js')) {
      return { code: MOCK_JS_STUB };
    }
    // Strip TypeScript assertions, then delegate to babel-jest.
    const cleaned = stripTypeAssertions(sourceText);
    return babelTransformerInstance.process(cleaned, sourcePath, options);
  },

  getCacheKey(sourceText, sourcePath, options) {
    if (sourcePath.endsWith('react-native/jest/mock.js')) {
      return crypto.createHash('md5').update(MOCK_JS_STUB).digest('hex');
    }
    const cleaned = stripTypeAssertions(sourceText);
    return babelTransformerInstance.getCacheKey(cleaned, sourcePath, options);
  },
};
