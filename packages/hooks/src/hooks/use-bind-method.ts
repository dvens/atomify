import { createHook } from './hook';

export const useBindMethod = (name: 'string', callback: () => void) =>
    createHook({
        onDidLoad(element) {
            element.constructor.prototype[name] = callback;
        },
    });
