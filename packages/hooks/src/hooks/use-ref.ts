import { createHook } from './hook';

export const useRef = <T>(initialValue: T) =>
    createHook<{ current: T }>({
        onDidLoad: () => ({ current: initialValue }),
    });
