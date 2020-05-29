import { DID_LOAD_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { supportsPassive } from '../utilities/support-passive';
import { createHook } from './hook';

type Target = { current: null[] | HTMLElement[] | null | HTMLElement };

interface ListenOptions {
    target: Target;
    capture?: boolean;
    passive?: boolean;
}

/**
 * UseListen is handling events( custom or normal ) that are being dispatched by elements or components.
 * @export
 * @param {string} eventName
 * @param {() => void} cb
 * @param {ListenOptions} options
 */
export const useListen = (eventName: string, cb: () => void, options: ListenOptions) =>
    createHook({
        onDidLoad(_, hooks) {
            hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: () => {
                    bindEvents(eventName, cb, options);
                },
            });
        },
        onUpdate(_, hooks) {
            hooks.callbacks.push({
                type: UPDATE_SYMBOL,
                callback: () => {
                    bindEvents(eventName, cb, options);
                },
            });
        },
        onDidUnload() {
            bindEvents(eventName, cb, options, true);
        },
    });

/**
 * @param {string} eventName
 * @param {() => void} cb
 * @param {items} items
 */
function bindEvents(eventName: string, cb: () => void, options: ListenOptions, remove = false) {
    const listenerOptions =
        supportsPassive && options
            ? {
                  capture: !!options.capture,
                  passive: !!options.passive,
              }
            : options && options.capture
            ? options.capture
            : false;
    const action = !remove ? 'addEventListener' : 'removeEventListener';

    if (options.target.current instanceof NodeList) {
        options.target.current.forEach((item) => {
            item && item[action](eventName, cb, listenerOptions);
        });
    } else if (options.target.current instanceof HTMLElement) {
        options.target.current[action](eventName, cb, listenerOptions);
    }
}
