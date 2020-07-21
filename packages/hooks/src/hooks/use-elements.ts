import { Component } from '../component';
import { DID_LOAD_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { createHook } from './hook';

type QueryTarget = Element | DocumentFragment | Document;

interface QueryComponent extends Component {
    [type: string]: any;
}

/**
 * Queries the render root ( this or the shadowdom ) from a custom element
 * And binds the selector to the custom element.
 * @param {string} selector
 * @param {boolean} [queryAll=false]
 * @param {QueryComponent} element
 * @param {QueryTarget} target
 * @returns
 */
function select<T>(
    selector: string,
    queryAll: boolean = false,
    element: QueryComponent,
    target: QueryTarget,
): T {
    const descriptor = {
        get() {
            return queryAll ? target.querySelectorAll(selector) : target.querySelector(selector);
        },

        enumerable: true,
        configurable: true,
    };

    Object.defineProperty(element, selector, descriptor);

    return element[selector];
}

/**
 * Selects a single element and bind the element to the custom element.
 * @param {string} selector
 * @param {QueryTarget} target (element or document)
 */
export const useElement = <T>(selector: string, target?: QueryTarget) =>
    createListenHook<T, null>(selector, false, target);
/**
 * Selects multiple elements and binds those elements to the custom element.
 * @param {string} selector
 * @param {QueryTarget} target
 */
export const useElements = <T>(selector: string, target?: QueryTarget) =>
    createListenHook<T, null[]>(selector, true, target);

/**
 * @param {string} selector
 * @param {boolean} queryAll
 * @param {QueryTarget} target
 */
const createListenHook = <T, D>(selector: string, queryAll: boolean, target?: QueryTarget) =>
    createHook<{ current: T | D }>({
        onDidLoad(element: QueryComponent, hooks, index) {
            const targetElement = target ? target : element.container;
            select<T>(selector, queryAll, element, targetElement);

            hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: () => {
                    hooks.state[index].current = element[selector];
                },
            });

            return Object.defineProperty(Object.create(null), 'current', {
                value: [],
                writable: true,
            });
        },
        onUpdate(element: QueryComponent, hooks, index) {
            hooks.callbacks.push({
                type: UPDATE_SYMBOL,
                callback: () => {
                    hooks.state[index].current = element[selector];
                },
            });
        },
    });
