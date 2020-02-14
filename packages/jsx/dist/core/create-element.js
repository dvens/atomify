import { isSVG } from '../utilities';
export const createElement = (nodeName, props, children) => {
    if (isSVG(nodeName))
        return document.createElementNS('http://www.w3.org/2000/svg', nodeName);
    if (nodeName === DocumentFragment)
        return document.createDocumentFragment();
    if (typeof nodeName === 'function')
        return nodeName(Object.assign(Object.assign({}, props), { children }));
    return document.createElement(nodeName);
};
//# sourceMappingURL=create-element.js.map