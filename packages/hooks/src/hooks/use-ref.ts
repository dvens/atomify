import { createHook } from './hook';
import { reactive } from './use-reactive';

export const useRef = <T>(initialValue: T) =>
    createHook<{ current: T }>({
        onDidLoad: (element) => {
            return reactive<{ current: T }>({ current: initialValue }, element);
        },
    });
