import { createHook } from './hook';

interface CustomEventOptions {
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
    eventName: string;
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

                element.dispatchEvent(event);
            }

            return {
                emit,
            };
        },
    });