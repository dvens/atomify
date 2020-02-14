function _delegate(options) {
    const { target, selector, type, callback, useCapture = false } = options;
    const listenerFn = (event) => {
        const delegateTarget = event.target.closest(selector);
        if (!delegateTarget)
            return;
        event.delegateTarget = delegateTarget;
        if (event.currentTarget.contains(event.delegateTarget)) {
            callback.call(target, event);
        }
    };
    target.addEventListener(type, listenerFn, useCapture);
    return {
        destroy() {
            target.removeEventListener(type, listenerFn, useCapture);
        }
    };
}
/**
    * Lightweight event delegation.
*/
export const delegate = (options) => {
    let { target, type } = options;
    if (typeof target === 'object' || typeof type === 'function') {
        return _delegate(Object.assign(Object.assign({}, options), { target }));
    }
    if (typeof target === 'string') {
        return Array.from(document.querySelectorAll(target))
            .map((element) => _delegate(Object.assign(Object.assign({}, options), { target: element })));
    }
    return null;
};
//# sourceMappingURL=delegate.js.map