import { InstanceMap } from '../inview.types';

/**
 * Listens to the changes and decides based upon the given thresholds when the callback is being called
 * @export
 * @param {IntersectionObserverEntry[]} changes
 * @param {InstanceMap} instanceMap
 */
export function onChange(changes: IntersectionObserverEntry[], instanceMap: InstanceMap) {
    changes.forEach(intersection => {
        const { isIntersecting, intersectionRatio, target } = intersection;
        const instance = instanceMap.get(target);

        if (instance && intersectionRatio >= 0) {
            // If threshold is an array, check if any of them intersects. This just triggers the onChange event multiple times.
            let inView = instance.thresholds.some(threshold => {
                return instance.inView
                    ? intersectionRatio > threshold
                    : intersectionRatio >= threshold;
            });

            if (isIntersecting !== undefined) {
                inView = inView && isIntersecting;
            }

            instance.inView = inView;
            instance.callback(inView, intersection);
        }
    });
}
