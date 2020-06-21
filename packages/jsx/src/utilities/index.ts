export * from './is-svg';
export * from './is-custom-element';
export * from './is-boolean-attr';

export type FunctionValue = (...args: any) => void;
export const isFunction = (value: string) => typeof value === 'function';
export const setAttr = (node: Element, attrName: string, attrValue: string) =>
    node.setAttribute(attrName, attrValue);
export const removeAttr = (node: Element, attrName: string) => node.removeAttribute(attrName);
