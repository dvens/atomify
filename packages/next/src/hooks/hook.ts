import { Component } from '../component/component';

type Hook<P extends unknown[], R> = (...args: P) => R;

let currentElement: Component;
let currentHookIndex: number | undefined = undefined;

/**
 * Sets the current element
 * @param element
 */
export const setCurrentElement = (element: Component) => (currentElement = element);

/**
 * Returns the current active element
 * @returns { Component }
 */
export const getCurrentElement = () => currentElement;

/**
 * Sets current hook index and check if the hook is used within a component.
 */
export const nextHook = () => {
    if (currentHookIndex === undefined) {
        throw new Error(`You can't use your hook outside of a component!`);
    }
    currentHookIndex = currentHookIndex + 1;
};

/**
 * Creates a hook and updates the current hook index.
 * @param hook
 */
export const createHook = <P extends unknown[], R>(hook: Hook<P, R>) => (...args: P): R => {
    nextHook();
    return hook(...args);
};
