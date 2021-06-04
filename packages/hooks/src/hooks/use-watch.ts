import { debounce } from '@atomify/shared';

import { Component } from '../component';
import { DID_LOAD_SYMBOL, DID_UNLOAD_SYMBOL } from '../symbols';
import { createHook } from './hook';

export const useWatch = (callback: () => void) =>
    createHook({
        onDidLoad(element, hooks) {
            hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: () => {
                    const dependencies = runAndGetDependencies(callback, element);
                    element.$cmpMeta$.$watchers$.push({
                        callback: debounce(callback, 10),
                        dependencies,
                    });
                },
            });
        },
        onDidUnload(element, hooks) {
            hooks.callbacks.push({
                type: DID_UNLOAD_SYMBOL,
                callback: () => {
                    element.$cmpMeta$.$watchers$ = [];
                },
            });
        },
    });

/**
 * @param {() => void} callback
 * @param {Component} element
 * @returns
 */
function runAndGetDependencies(callback: () => void, element: Component) {
    element.$cmpMeta$.$dependencies$.clear();
    callback();
    const deps = new Set(element.$cmpMeta$.$dependencies$);
    element.$cmpMeta$.$dependencies$.clear();
    return deps;
}
