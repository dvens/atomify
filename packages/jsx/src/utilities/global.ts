export type FunctionValue = (...args: any) => void;
export type RefFunction = (node: Element) => void;
export type Ref = { current: any };

export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
export const isNullValue = (value: any | null): value is null => value == null || value === false;
export const isString = (value: any): value is string => typeof value === 'string';
export const isFunction = (value: any): value is Function => typeof value === 'function';
export const isObject = (value: any): value is object =>
    value != null && typeof value === 'object' && Array.isArray(value) === false;
export const isElement = (value: any): value is HTMLElement | SVGElement =>
    (value && value instanceof HTMLElement) || value instanceof SVGElement;
export const isNumber = (value: any): value is number => typeof value === 'number';
export const isFragment = (value: any): value is typeof DocumentFragment =>
    value && 'name' in value && value.name === 'Fragment';
