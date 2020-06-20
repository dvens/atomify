import { Component } from '../component';
import { PHASE_SYMBOL, REFLECTING_TO_ATTRIBUTE, REFLECTING_TO_PROPERTY } from '../symbols';
import { toAttribute } from '../utilities';
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

/**
 * @param { Component } element
 * @param { string } name
 * @param { unknown } newValue
 */
const reflectPropertyToAttribute = (element: Component, attrName: string, newValue: unknown) => {
    if (newValue === undefined || element[PHASE_SYMBOL] === REFLECTING_TO_PROPERTY) return;

    const { name, value } = toAttribute(attrName, newValue, element);

    element[PHASE_SYMBOL] = REFLECTING_TO_ATTRIBUTE;

    if (value == null) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, value);
    }

    element[PHASE_SYMBOL] = null;
};

export const useProp = <T = unknown>(
    name: string,
    value: T,
    options?: { reflectToAttr: boolean },
) =>
    createHook<[T, (s: T) => void, (callback: PropertyCallback<T>) => void]>({
        onDidLoad(element, hooks, index) {
            if (!(name in element.props))
                throw new Error(
                    `Please add the ${name} as property to the ${element.$cmpMeta$.$tagName$} prop map`,
                );

            const key = `_${name}`;
            const initialValue = (element as PropertyElement<T>)[name] || value;
            const { reflectToAttr = false } = options || {};

            // Callback that gets set when its used.
            let callback: PropertyCallback<T> | null = null;

            Object.defineProperty(element, name, {
                get() {
                    return this[key];
                },

                set(this: Component, value: any) {
                    const oldValue = (this as PropertyElement<T>)[name];
                    (this as PropertyElement<unknown>)[key] = value;

                    const hasValueChanged = valueHasChanged(value, oldValue);

                    // Call callbacks when a value has changed.
                    if (hasValueChanged && callback) {
                        callback(value as T, oldValue);
                    }

                    // Update the initial hook value.
                    hooks.state[index][0] = value;

                    if (hasValueChanged && reflectToAttr) {
                        reflectPropertyToAttribute(element, name, value);
                    }
                },

                enumerable: true,
                configurable: true,
            });

            function setState(value: T) {
                (element as PropertyElement<T>)[name] = value;
            }

            function watchCallback(cb: PropertyCallback<T>) {
                if (!callback) callback = cb;
            }

            // Set initial value of the getter.
            (element as PropertyElement<T>)[key] = initialValue;

            return [initialValue, setState, watchCallback];
        },
    });
