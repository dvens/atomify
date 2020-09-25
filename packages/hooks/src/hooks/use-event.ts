import { createHook } from './hook';

interface CustomEventOptions {
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
    eventName: string;
    target?: Window | Document;
}

export const useEvent = <T>(options: CustomEventOptions) =>
    createHook<{ emit: (value: T) => void }>({
        onDidLoad(element) {
            function emit(value: T) {
                const eventName = options.eventName;
                const eventOptions = Object.assign(
                    {},
                    { detail: value, bubbles: true, cancelable: true },
                    options,
                );

                const event = new CustomEvent(eventName, eventOptions);
                const target = options.target ? options.target : element;
                target.dispatchEvent(event);
            }

            return {
                emit,
            };
        },
    });
