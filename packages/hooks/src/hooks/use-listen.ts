import { Component } from '../component/component';
import { DID_LOAD_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { supportsPassive } from '../utilities/support-passive';
import { createHook } from './hook';

type EventQueryTarget = { current: null[] | HTMLElement[] | null | HTMLElement };

interface ListenOptions {
    target: EventQueryTarget | Window | Document | Component;
    capture?: boolean;
    passive?: boolean;
}

interface BindEventOptions {
    eventName: string;
    cb: (e: Event) => void;
    options: ListenOptions;
    remove?: boolean;
    element: Component;
}

interface SaveEvent extends BindEventOptions {
    target: Window | Document | Node;
}

export type ListenMap = Map<string, ListenMapItem>;
export interface ListenMapItem {
    eventName: string;
    callbackWrapper: (e: Event) => void;
    options: ListenOptions;
}

/**
 * UseListen is handling events( custom or normal ) that are being dispatched by elements or components.
 * @export
 * @param {string} eventName
 * @param {() => void} cb
 * @param {ListenOptions} options
 */
export const useListen = (eventName: string, cb: (e?: any) => void, options: ListenOptions) =>
    createHook({
        onDidLoad(element, hooks) {
            hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: () => {
                    bindEvents({ eventName, cb, options, element });
                },
            });
        },
        onUpdate(element, hooks) {
            hooks.callbacks.push({
                type: UPDATE_SYMBOL,
                callback: () => {
                    bindEvents({ eventName, cb, options, element });
                },
            });
        },
        onDidUnload(element) {
            bindEvents({ eventName, cb, options, remove: true, element });
        },
    });

/**
 * @param {BindEventOptions} { options, remove = false, eventName, cb, element }
 */
function bindEvents({ options, remove = false, eventName, cb, element }: BindEventOptions) {
    if (
        options.target instanceof Window ||
        options.target instanceof Document ||
        options.target instanceof HTMLElement
    ) {
        trackEventListener({ options, target: options.target, element, remove, cb, eventName });
    } else if (
        options.target.current instanceof NodeList ||
        Array.isArray(options.target.current)
    ) {
        Array.from(options.target.current).forEach(
            (item) =>
                item &&
                trackEventListener({ options, target: item, element, remove, cb, eventName }),
        );
    } else if (options.target.current instanceof HTMLElement) {
        trackEventListener({
            options,
            target: options.target.current,
            element,
            remove,
            cb,
            eventName,
        });
    }
}

function removeListener(listeners: ListenMap, eventId: string, target: Window | Document | Node) {
    const listener = listeners.get(eventId);
    if (listener) {
        target.removeEventListener(listener.eventName, listener.callbackWrapper, listener.options);
    }
}

function trackEventListener({ cb, element, target, remove, options, eventName }: SaveEvent) {
    const eventId = `${element.$cmpMeta$.$id$}_${eventName}_${target}_${cb.toString()}`;
    const listeners = element.$cmpMeta$.$listeners$;

    // Return when its only removing the event listener.
    if (remove && listeners.has(eventId)) {
        removeListener(listeners, eventId, target);
        listeners.delete(eventId);

        return;
    }

    const callbackWrapper = (ev: Event) => cb(ev);
    const listenerOptions =
        supportsPassive && options
            ? {
                  capture: !!options.capture,
                  passive: !!options.passive,
              }
            : options && options.capture
            ? options.capture
            : false;

    // Remove event listeners if its already bound then re-add the listener.
    if (listeners.has(eventId)) {
        removeListener(listeners, eventId, target);
    }

    listeners.set(eventId, {
        eventName,
        callbackWrapper,
        options,
    });

    target.addEventListener(eventName, callbackWrapper, listenerOptions);
}
