import {
    ElementMap,
    InstanceMap,
    ObserverInstance,
    ObserverInstanceCallback,
    ObserverMap,
} from './inview.types';
import {
    buildThresholdList,
    generateOptionsId,
    generateUniqueElementId,
    hasObserverItems,
    onChange,
} from './utils';

const INSTANCES: InstanceMap = new Map();
const OBSERVERS: ObserverMap = new Map();
const ELEMENT_IDS: ElementMap = new Map();
const DEFAULT_ROOT = document.querySelector('body');

class Inview {
    /**
     * Observes element, and triggers the callback each time its getting observed
     * @param {Element} element
     * @param {ObserverInstanceCallback} callback
     * @param {IntersectionObserverInit} [options={}]
     * @memberof Inview
     */
    observe(
        element: Element,
        callback: ObserverInstanceCallback,
        options: IntersectionObserverInit = {},
    ) {
        if (!element) return;

        if (INSTANCES.has(element))
            throw new Error(
                `Trying to observe ${Element} this one is already observed by another instance.`,
            );

        if (typeof options.threshold === 'undefined') {
            options.threshold = buildThresholdList();
        }

        const { threshold, root = DEFAULT_ROOT } = options;
        const uniqueId = `${generateUniqueElementId(ELEMENT_IDS, root)}`;
        const instanceId = generateOptionsId(uniqueId, options);

        let observer = OBSERVERS.get(instanceId);

        if (!observer) {
            observer = new IntersectionObserver(changes => onChange(changes, INSTANCES), options);
            if (instanceId) OBSERVERS.set(instanceId, observer);
        }

        const instance: ObserverInstance = {
            callback,
            element,
            instanceId,
            inView: false,
            observer,
            thresholds: Array.isArray(threshold) ? threshold : [threshold],
        };

        INSTANCES.set(element, instance);
        instance.observer.observe(element);

        return instance;
    }

    /**
     * Unobserve the element and removes the them from the instance map;
     * @param {(Element | null)} element
     * @memberof Inview
     */
    unobserve(element: Element | null) {
        if (!element) return;

        const instance = INSTANCES.get(element);

        if (instance) {
            const { observer, instanceId } = instance;

            const { rootHasItemsLeft, rootIsObserved } = hasObserverItems(
                INSTANCES,
                observer.root,
                element,
                instanceId,
            );

            observer.unobserve(element);

            if (!rootIsObserved && observer.root) ELEMENT_IDS.delete(observer.root);

            // only disconnected when no items are left.
            if (observer && !rootHasItemsLeft) {
                observer.disconnect();
            }

            INSTANCES.delete(element);
        }
    }

    /**
     * Destroys all intersection observers
     * @memberof Inview
     */
    destroy() {
        INSTANCES.forEach(instance => instance.observer.disconnect());
        INSTANCES.clear();
        ELEMENT_IDS.clear();
        OBSERVERS.clear();
    }
}

export const inviewObserver = new Inview();
