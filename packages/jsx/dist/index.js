import { createElement, createFragementFromChildren, applyAttributes } from "./core";
export const h = (nodeName, vnodeData, ...children) => {
    const element = createElement(nodeName, vnodeData, children);
    const isNotFunctionalComponent = !(typeof nodeName === 'function' && nodeName !== DocumentFragment);
    if (isNotFunctionalComponent) {
        const fragment = createFragementFromChildren(children);
        element.appendChild(fragment);
    }
    return isNotFunctionalComponent ? applyAttributes(element, vnodeData) : element;
};
export const Fragment = DocumentFragment;
//# sourceMappingURL=index.js.map