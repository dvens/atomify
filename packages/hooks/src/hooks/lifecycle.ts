import { DID_LOAD_SYMBOL, DID_UNLOAD_SYMBOL } from '../symbols';
import { createHook } from './hook';

export const onDidLoad = (cb: () => void) =>
    createHook({
        onDidLoad(element) {
            element.__hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: cb,
            });
        },
    });

export const onUpdated = (cb: () => void) =>
    createHook({
        onUpdate() {
            cb();
        },
    });

export const onDidUnload = (cb: () => void) =>
    createHook({
        onDidLoad(element) {
            element.__hooks.callbacks.push({
                type: DID_UNLOAD_SYMBOL,
                callback: cb,
            });
        },
    });
