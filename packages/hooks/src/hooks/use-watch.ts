import { Component } from '../component';
import { debounce } from './../utilities/debounce';
import { createHook } from './hook';

export const useWatch = (callback: () => void) =>
    createHook({
        onDidLoad(element) {
            const dependencies = runAndGetDependencies(callback, element);
            console.log(dependencies);
            element.$cmpMeta$.$watchers$.push({
                callback: debounce(callback, 10),
                dependencies,
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
