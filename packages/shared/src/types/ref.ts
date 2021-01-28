export interface MutableRefObject<T> {
    current: T;
}
export interface RefObject<T> {
    readonly current: T | null;
}

export type FunctionValue = (...args: any) => void;
export type RefFunction = (node: Element) => void;
