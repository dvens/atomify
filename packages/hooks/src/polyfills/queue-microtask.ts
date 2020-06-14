export const queueMicrotaskPolyfill = () => {
    if (typeof window.queueMicrotask !== 'function') {
        window.queueMicrotask = function (callback) {
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
