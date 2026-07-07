// prismSetup.js — one place that registers Prism and the language grammars
// this app needs. Import ORDER matters here: each component file mutates the
// shared Prism.languages object, and some languages extend others —
// prism-c.js and prism-java.js both require prism-clike.js to already be
// registered, and prism-cpp.js requires prism-c.js. Getting the order wrong
// throws at import time, not silently — so don't reorder these.
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

// highlightCode — returns highlighted HTML (span.token.* wrapped) for a raw
// code string in a given language. Falls back to the generic "clike" grammar
// for anything unrecognized rather than throwing, so a typo'd language key
// degrades to "still readable, just not perfectly tokenized" instead of a
// crash.
//
// Safe to feed into dangerouslySetInnerHTML here because the input is always
// developer-authored code from problemDetails.js, never raw user input.
export function highlightCode(code, lang) {
  const grammar = Prism.languages[lang] || Prism.languages.clike;
  return Prism.highlight(code, grammar, lang);
}

export default Prism;