import { Component } from '../component';
import { createHook } from './hook';

export const useReactive = <T extends object>(initialState: T) =>
    createHook<T>({
        onDidLoad(element) {
            console.log(initialState);
            return reactive<T>(initialState, element);
        },
    });

/**
 * @param {Component} element
 * @param {symbol} symbol
 * @returns
 */
function getWatchersDependingOn(element: Component, symbol: symbol) {
    const watchers = element.$cmpMeta$.$watchers$;
    return watchers.filter(({ dependencies }) => dependencies.has(symbol));
}

/**
 * Creates a reactive object.
 * @template T
 * @param {T} initialState
 * @param {Component} element
 * @returns
 */
export const reactive = <T extends object>(initialState: T, element: Component): T => {
    const reactiveObject = {};

    for (const [key, value] of Object.entries(initialState)) {
        let internalValue =
            value != null && typeof value === 'object' ? reactive(value, element) : value;

        const symbol = Symbol(key);

        Object.defineProperty(reactiveObject, key, {
            enumerable: true,
            get() {
                element.$cmpMeta$.$dependencies$.add(symbol);
                return internalValue;
            },
            set(newValue) {
                if (
                    internalValue != null &&
                    typeof internalValue === 'object' &&
                    typeof newValue === 'object'
                ) {
                    Object.assign(internalValue, newValue);
                } else {
                    internalValue = newValue;
                }
                getWatchersDependingOn(element, symbol).forEach(({ callback }) => callback());
            },
        });
    }
    return reactiveObject as T;
};
