import { supportsPassive } from '../utilities';
import { BOUND_LISTENERS } from '../constants';
/**
    * @Listen decorator is handling events( custom or normal ) that are being dispatched by elements or components.
*/
export const Listen = (eventType, options) => {
    return (target, methodName) => {
        if (!target.constructor[BOUND_LISTENERS]) {
            target.constructor[BOUND_LISTENERS] = [];
        }
        if (methodName && typeof target[methodName] === 'function') {
            const listenerOptions = supportsPassive && options ? {
                capture: !!options.capture,
                passive: !!options.passive,
            } : options && options.capture ? options.capture : false;
            target.constructor[BOUND_LISTENERS].push({
                type: eventType,
                handler: target[methodName],
                options: listenerOptions,
                eventTarget: options && options.target ? options.target : false,
            });
        }
        else {
            throw Error('The listen decorator needs a valid method name');
        }
    };
};
/**
    * Adds and removes event listeners based up on the connected and disconnected callback.
*/
export const addRemoveEventListeners = (targetElement, type = 'addEventListener') => {
    const items = targetElement.constructor[BOUND_LISTENERS];
    const defaultTarget = targetElement;
    return new Promise((resolve) => {
        if (!items)
            return resolve();
        items.forEach((item) => {
            const eventTarget = getEventTarget(targetElement, defaultTarget, item.eventTarget);
            if ((NodeList.prototype.isPrototypeOf(eventTarget) || Array.isArray(eventTarget)) &&
                eventTarget.length > 0) {
                Array.from(eventTarget)
                    .map((target) => target[type](item.type, (e) => {
                    item.handler.call(targetElement, e);
                }, item.options));
            }
            else {
                eventTarget[type](item.type, (e) => {
                    item.handler.call(targetElement, e);
                }, item.options);
            }
        });
        resolve();
    });
};
function getEventTarget(target, defaultTarget, eventTarget) {
    if (eventTarget && typeof eventTarget !== 'string') {
        return eventTarget;
    }
    if (eventTarget && typeof eventTarget === 'string') {
        if (!target[eventTarget])
            throw new Error(`${eventTarget} has to be called by the @Query or @QueryAll decorator`);
        return target[eventTarget];
    }
    return defaultTarget;
}
//# sourceMappingURL=listen.js.map