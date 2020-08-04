import { createHook } from './hook';
import { reactive } from './use-reactive';

export interface MutableRefObject<T> {
    current: T;
}
export interface RefObject<T> {
    readonly current: T | null;
}

export function useRef<T>(initialValue: T): MutableRefObject<T>;
export function useRef<T = undefined>(initialValue?: T): MutableRefObject<T | undefined>;
export function useRef<T>(initialValue: T | null): RefObject<T> {
    return createHook({
        onDidLoad: (element) => {
            return reactive<RefObject<T>>({ current: initialValue }, element);
        },
    });
}
