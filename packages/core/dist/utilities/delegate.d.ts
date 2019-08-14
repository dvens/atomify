interface SharedOptions {
    selector: string;
    type: string;
    callback: (event: Event) => void;
    useCapture?: boolean;
}
interface DelegateOptions extends SharedOptions {
    target: EventTarget;
}
/**
    * Lightweight event delegation.
*/
export declare const delegate: (options: DelegateOptions) => {
    destroy(): void;
} | {
    destroy(): void;
}[] | null;
export {};
//# sourceMappingURL=delegate.d.ts.map