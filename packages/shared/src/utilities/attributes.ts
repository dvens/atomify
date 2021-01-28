export const setAttr = (node: Element, attrName: string, attrValue: string) =>
    node.setAttribute(attrName, attrValue);
export const removeAttr = (node: Element, attrName: string) => node.removeAttribute(attrName);
