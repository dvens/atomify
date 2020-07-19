import { HasObserverItems,InstanceMap } from '../inview.types';

/**
 * Checks if the observer has still elements left and when it still needs to be observed.
 * @export
 * @param {InstanceMap} instances
 * @param {(Element | null)} root
 * @param {Element} element
 * @param {string} instanceId
 * @returns {HasObserverItems}
 */
export function hasObserverItems(
    instances: InstanceMap,
    root: Element | null,
    element: Element,
    instanceId: string,
): HasObserverItems {
    let rootIsObserved = false;
    let rootHasItemsLeft = false;

    instances.forEach((item, key) => {
        if (key !== element) {
            if (item.instanceId === instanceId) {
                rootHasItemsLeft = true;
                rootIsObserved = true;
            }

            if (item.observer.root === root) {
                rootIsObserved = true;
            }
        }
    });

    return {
        rootIsObserved,
        rootHasItemsLeft,
    };
}
