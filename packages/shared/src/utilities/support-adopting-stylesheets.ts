/**
 * Checks if adopting stylesheet is supported.
 */
export const supportsAdoptingStyleSheets = () =>
    'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
