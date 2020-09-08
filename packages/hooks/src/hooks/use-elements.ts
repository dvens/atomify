import { Component } from '../component';
import { DID_LOAD_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { createHook } from './hook';

type QueryTarget = Element | DocumentFragment | Document;

interface QueryComponent extends Component {
    [type: string]: any;
}

type QueryOptions = {
    root?: QueryTarget;
    as?: string;
};

/**
 * Queries the render root ( this or the shadowdom ) from a custom element
 * And binds the selector to the custom element.
 * @param {string} selector
 * @param {boolean} [queryAll=false]
 * @param {QueryComponent} element
 * @param {QueryOptions} Options
 * @returns
 */
function select<T>(
    selector: string,
    queryAll: boolean = false,
    element: QueryComponent,
    target: QueryTarget,
    bindAs: string,
): T {
    const descriptor = {
        get() {
            return queryAll ? target.querySelectorAll(selector) : target.querySelector(selector);
        },

        enumerable: true,
        configurable: true,
    };

    Object.defineProperty(element, bindAs, descriptor);

    return element[bindAs];
}

/**
 * Selects a single element and bind the element to the custom element.
 * @param {string} selector
 * @param {QueryOptions} Options
 */
export const useElement = <T>(selector: string, options?: QueryOptions) =>
    createListenHook<T, null>(selector, false, options);
/**
 * Selects multiple elements and binds those elements to the custom element.
 * @param {string} selector
 * @param {QueryOptions} Options
 */
export const useElements = <T>(selector: string, options?: QueryOptions) =>
    createListenHook<T, null[]>(selector, true, options);

/**
 * @param {string} selector
 * @param {boolean} queryAll
 * @param {QueryOptions} Options
 */
const createListenHook = <T, D>(selector: string, queryAll: boolean, options?: QueryOptions) =>
    createHook<{ current: T | D }>({
        onDidLoad(element: QueryComponent, hooks, index) {
            const targetElement = options && options.root ? options.root : element.container;
            const bindAs = options && options.as && options.as !== '' ? options.as : selector;
            select<T>(selector, queryAll, element, targetElement, bindAs);

            hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: () => {
                    hooks.state[index].current = element[bindAs];
                },
            });

            return Object.defineProperty(Object.create(null), 'current', {
                value: [],
                writable: true,
            });
        },
        onUpdate(element: QueryComponent, hooks, index) {
            const bindAs = options && options.as && options.as !== '' ? options.as : selector;

            hooks.callbacks.push({
                type: UPDATE_SYMBOL,
                callback: () => {
                    hooks.state[index].current = element[bindAs];
                },
            });
        },
    });
