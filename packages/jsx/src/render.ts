import { createElement } from './dom';
import { VNode } from './types';
import { isNullValue } from './utilities/index';

export const render = (
    vnode: VNode,
    parent: Element | Document | ShadowRoot | DocumentFragment,
) => {
    if (!isNullValue(vnode)) {
        const element = createElement(vnode);

        parent.appendChild(element);
    }
};
