export interface CustomEventOptions {
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
    eventName?: string;
}

export interface ListenOptions {
    target?: EventType;
    capture?: boolean;
    passive?: boolean;
}

export type EventType = EventTarget | string | boolean;

export interface InitializedEvents {
    type: string;
    eventTarget?: EventType;
    options: ListenOptions;
    handler: (target: any) => void;
}
