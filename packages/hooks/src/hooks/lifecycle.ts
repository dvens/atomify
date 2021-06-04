import { DID_LOAD_SYMBOL, DID_UNLOAD_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { createHook } from './hook';

export const onDidLoad = (cb: () => void) =>
    createHook({
        onDidLoad(_, hooks) {
            hooks.callbacks.push({
                type: DID_LOAD_SYMBOL,
                callback: cb,
            });
        },
    });

export const onDidUnload = (cb: () => void) =>
    createHook({
        onDidUnload(_, hooks) {
            hooks.callbacks.push({
                type: DID_UNLOAD_SYMBOL,
                callback: cb,
            });
        },
    });

export const onUpdated = (cb: () => void) =>
    createHook({
        onUpdate(_, hooks) {
            hooks.callbacks.push({
                type: UPDATE_SYMBOL,
                callback: cb,
            });
        },
    });
