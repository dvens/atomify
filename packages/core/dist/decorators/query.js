/**
 * Queries the render root ( this or the shadowdom ) from a custom element
 * And binds the selector to the custom element.
 * @param selector
 * @param queryAll
*/
function select(selector, queryAll = false, target) {
    return (propertyTarget, propertyName) => {
        const descriptor = {
            get() {
                const targetElement = target ? target : this.renderRoot;
                return (queryAll)
                    ? targetElement.querySelectorAll(selector)
                    : targetElement.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return Object.defineProperty(propertyTarget, propertyName, descriptor);
    };
}
/**
 * Queries and returns a single element.
 * @param selector name of the selector that has to be queried.
*/
export const Query = (selector, target) => {
    return select(selector, false, target);
};
/**
 * Queries and returns a list of dom elements.
 * @param selector name of the selector that has to be queried
*/
export const QueryAll = (selector, target) => {
    return select(selector, true, target);
};
//# sourceMappingURL=query.js.map