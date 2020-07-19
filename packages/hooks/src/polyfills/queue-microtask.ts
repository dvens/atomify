export const queueMicrotaskPolyfill = () => {
    if (typeof window.queueMicrotask !== 'function') {
        window.queueMicrotask = function (callback: () => void) {
            Promise.resolve()
                .then(callback)
                .catch((e) =>
                    setTimeout(() => {
                        throw e;
                    }),
                ); // report exceptions
        };
    }
};
