import { Component } from '../component';
import { createHook } from './hook';

type PropertyTypeHint = unknown;

type PropertyElement<T> = Component & { [name: string]: T };

type PropertyCallback<T> = (newValue: T, oldValue: T) => void;

export type Property = {
    [key: string]: PropertyTypeHint;
};

/**
 * Check if a property has changed
 * @param { unknown } value
 * @param { unknown } old
 * @returns { boolean }
 */
const valueHasChanged = (value: unknown, old: unknown): boolean => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};

export const useProp = <T = unknown>(
    name: string,
    value: T,
    options?: { reflectToAttr: boolean },
) =>
    createHook<[T, (s: T) => void, (callback: PropertyCallback<T>) => void]>({
        onDidLoad(element) {
            if (!(name in element.props))
                throw new Error(
                    `Please add the ${name} as property to the ${element.$cmpMeta$.$tagName$} prop map`,
                );

            const key = `_${name}`;
            const initialValue = (element as PropertyElement<T>)[name] || value;
            const callbacks: Array<PropertyCallback<T>> = [];
            const { reflectToAttr = false } = options || {};

            Object.defineProperty(element, name, {
                get() {
                    return this[key];
                },

                set(this: Component, value: unknown) {
                    const oldValue = (this as PropertyElement<T>)[name];
                    (this as PropertyElement<unknown>)[key] = value;

                    // Call callbacks when a value has changed.
                    if (valueHasChanged(value, oldValue)) {
                        callbacks.forEach((cb) => cb(value as T, oldValue));
                    }

                    if (reflectToAttr) {
                        // reflect to attribute
                    }
                },

                enumerable: true,
                configurable: true,
            });

            function setState(value: T) {
                (element as PropertyElement<T>)[name] = value;
            }

            function watchCallback(cb: PropertyCallback<T>) {
                callbacks.push(cb);
            }

            (element as PropertyElement<T>)[key] = initialValue;

            return [initialValue, setState, watchCallback];
        },
    });
