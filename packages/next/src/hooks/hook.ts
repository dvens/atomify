import { Component } from '../component/component';
import { Phase, phaseSymbol } from './../symbols';

type Hook<P extends unknown[], R> = (...args: P) => R;

let currentElement: Component | null;
let currentHookIndex: number = 0;

export const clear = () => {
    currentElement = null;
    currentHookIndex = 0;
};

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
 * Returns the current phase of the component.
 * @returns { phaseSymbol }
 */
export const getCurrentElementPhase = (): Phase | null => {
    const element = getCurrentElement();
    return element ? element[phaseSymbol] : null;
};

/**
 * Sets current hook index and check if the hook is used within a component.
 */
export const nextHook = () => {
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
