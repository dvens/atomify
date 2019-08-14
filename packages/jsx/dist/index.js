import { createElement, createFragementFromChildren, applyAttributes } from "./core";
export const h = (nodeName, vnodeData, ...children) => {
    const element = createElement(nodeName, vnodeData, children);
    const fragment = createFragementFromChildren(children);
    element.appendChild(fragment);
    return applyAttributes(element, vnodeData);
};
export const Fragment = DocumentFragment;
//# sourceMappingURL=index.js.map