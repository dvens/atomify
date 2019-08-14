import { CustomEventOptions } from '../declarations';
export interface EventEmitter {
    emit(value: any): void;
}
/**
    * Creates custom events that can be emitted inside the components.
*/
export declare const Event: (options?: CustomEventOptions) => (target: HTMLElement, propertyName: string) => any;
//# sourceMappingURL=event.d.ts.map