export * from './is-svg';
export * from './is-custom-element';
export * from './is-boolean-attr';
export * from './class-names';

export type FunctionValue = (...args: any) => void;
export type RefFunction = (node: Element) => void;
export type Ref = { current: any };
export const isFunction = (value: string) => typeof value === 'function';
export const setAttr = (node: Element, attrName: string, attrValue: string) =>
    node.setAttribute(attrName, attrValue);
export const removeAttr = (node: Element, attrName: string) => node.removeAttribute(attrName);
export const isBoolean = (value: boolean) => typeof value === 'boolean';
export const isNullValue = (value: boolean | null) => value == null || value === false;
