import { createHook } from './hook';

export const useBindMethod = (name: string, callback: (...args: any[]) => void) =>
    createHook({
        onDidLoad(element) {
            element.constructor.prototype[name] = (...args: any[]) => {
                callback(...args);
            };
        },
    });
