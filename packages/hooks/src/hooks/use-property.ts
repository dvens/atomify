import { Component } from '../component';
import {
    REFLECTING_TO_ATTRIBUTE,
    REFLECTING_TO_PROPERTY,
    SIDE_EFFECT_PHASE_SYMBOL,
} from '../symbols';
import { toAttribute } from '../utilities';
import { createHook } from './hook';

type PropertyTypeHint = unknown;

type PropertyElement<T> = Component & { [name: string]: T };

type PropertyCallback<T> = (newValue: T, oldValue: T) => void;

type PropertyHook<T> = [T, (s: T) => void, (callback: PropertyCallback<T>) => void];

export type Property = {
    [key: string]: {
        type?: PropertyTypeHint;
        reflectToAttr?: boolean;
        required?: boolean;
    };
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
    if (newValue === undefined || element[SIDE_EFFECT_PHASE_SYMBOL] === REFLECTING_TO_PROPERTY)
        return;

    const { name, value } = toAttribute(attrName, newValue, element);

    element[SIDE_EFFECT_PHASE_SYMBOL] = REFLECTING_TO_ATTRIBUTE;

    if (value == null) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, value);
    }

    element[SIDE_EFFECT_PHASE_SYMBOL] = null;
};

export function useProp<T>(name: string, value?: T): PropertyHook<T>;
export function useProp<T>(name: string, value: T): PropertyHook<T> {
    return createHook({
        onDidLoad(element, hooks, index) {
            const hasNoValue = typeof value === 'undefined';

            let valueIsRequired = false;

            if (!(name in element.props))
                throw new Error(
                    `Please add the ${name} as property to the ${element.$cmpMeta$.$tagName$} prop map`,
                );

            if (hasNoValue && name in element.props) {
                const { required = false } = element.props[name];
                if (!required) {
                    throw new Error(
                        `The value for ${name} is undefined and doesnt have a initial value so it should be required. Add the required boolean as true for ${name} to the ${element.$cmpMeta$.$tagName$} prop map or add an initial value as second param to the useProp hook.`,
                    );
                }

                valueIsRequired = required;
            }

            const key = `_${name}`;
            const initialValue = (element as PropertyElement<T>)[name] || value;
            const reflectToAttr = element.props[name].reflectToAttr || false;

            if (valueIsRequired && typeof initialValue === 'undefined') {
                throw new Error(
                    `The value of ${name} is undefined but required make sure that the ${name} prop is filled in.`,
                );
            }

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

            // Initialize property to attributes when the property has the reflectToAttr option.
            if (reflectToAttr) {
                reflectPropertyToAttribute(element, name, initialValue);
            }

            return [initialValue, setState, watchCallback];
        },
    });
}
