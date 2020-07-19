import { ElementMap } from '../inview.types';

/**
 * @param elementIds
 * @param root
 */
export function generateUniqueElementId(elementIds: ElementMap, root?: Element | null) {
    if (!root) return '';

    if (elementIds.has(root)) return elementIds.get(root);

    const generatedId = `${Math.random()
        .toString(36)
        .substr(2, 9)}_`;

    elementIds.set(root, generatedId);

    return elementIds.get(root);
}

/**
 * Generates an ID based upon the rootId and options to use as a reference for elements with the same options.
 * @export
 * @param {string} rootId
 * @param {IntersectionOptions} options
 * @returns { string }
 */
export function generateOptionsId(rootId: string, options: IntersectionObserverInit) {
    const { rootMargin, threshold } = options;
    const thresholdId = threshold ? threshold.toString() : '';
    const optionsId = rootMargin ? `${thresholdId}_${rootMargin}` : thresholdId;

    return `${rootId}${optionsId}`;
}
