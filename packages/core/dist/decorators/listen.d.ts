import { ListenOptions } from '../declarations';
/**
    * @Listen decorator is handling events( custom or normal ) that are being dispatched by elements or components.
*/
export declare const Listen: (eventType: string, options?: ListenOptions | undefined) => (target: any, methodName: string) => void;
/**
    * Adds and removes event listeners based up on the connected and disconnected callback.
*/
export declare const addRemoveEventListeners: (targetElement: any, type?: string) => Promise<unknown>;
//# sourceMappingURL=listen.d.ts.map