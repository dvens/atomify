import { isSVG } from '../utilities';

export const createElement = (nodeName: any, props: object, children: any) => {
    if (isSVG(nodeName)) return document.createElementNS('http://www.w3.org/2000/svg', nodeName);
    if (nodeName === DocumentFragment) return document.createDocumentFragment();
    if (typeof nodeName === 'function') return nodeName({ ...props, children });

    return document.createElement(nodeName);
};
