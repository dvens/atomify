import { Component } from '../component';
import { DID_LOAD_SYMBOL, Phase, PHASE_SYMBOL, UPDATE_SYMBOL } from '../symbols';

export interface Hooks<T = any> {
    state: T[];
    callbacks: Array<{ type: Phase; callback: () => void }>;
}

export interface Hook<T> {
    onUpdate?: (element: Component, hooks: Hooks<T>, index: number) => void;
    onDidLoad?: (element: Component, hooks: Hooks<T>, index: number) => T;
    onDidUnload?: (element: Component, hooks: Hooks<T>, index: number) => void;
}

let currentElement: Component | null = null;
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
    return element ? element[PHASE_SYMBOL] : null;
};

/**
 * Sets current hook index and check if the hook is used within a component.
 */
const nextHook = () => {
    currentHookIndex = currentHookIndex + 1;
    return currentHookIndex;
};

/**
 * Creates a hook and updates the current hook index.
 * @export
 * @template T
 * @param {Hooks<T>} config
 * @returns {T}
 */
export function createHook<T>(config: Hook<T>): T {
    const index = nextHook();
    const currentElement = getCurrentElement();

    if (!currentElement) throw new Error('Hooks can only be used within a Component');

    const hooks = currentElement.$cmpMeta$.$hooks$ as Hooks<T>;
    const phase = getCurrentElementPhase();

    // Check if the onDidLoad function exists on the hook and if the current phase is did load.
    if (phase === DID_LOAD_SYMBOL && config.onDidLoad) {
        hooks.state[index] = config.onDidLoad(currentElement, hooks, index);
    }

    // The on update function is also called the first time the component renders.
    if (phase === UPDATE_SYMBOL && config.onUpdate) {
        config.onUpdate(currentElement, hooks, index);
    }

    return hooks.state[index];
}
