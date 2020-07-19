import { createHook } from './hook';

export const useBindMethod = (name: string, callback: (...args: any[]) => void) =>
    createHook({
        onDidLoad(element) {
            const method = (...args: any[]) => callback(...args);
            (element as any)[name] = method;
        },
    });
