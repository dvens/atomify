export const isCSSElement = (node: any): node is HTMLStyleElement =>
    node instanceof HTMLStyleElement;
export const isCSSStyleHook = (node: ChildNode) =>
    isCSSElement(node) && node.hasAttribute('style-hook');
