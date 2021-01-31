import { isNullValue, isString } from '@atomify/shared';

import { createElement } from './dom';
import { Container, VNode } from './types';

type JSXRenderFN<C = any> = (
    result: VNode | string,
    container: HTMLElement | ShadowRoot,
    name: string,
    component: C,
) => void;

export const render = (vnode: VNode, container: Container) => {
    if (!isNullValue(vnode)) {
        const element = createElement(vnode);
        container.appendChild(element);
    }
};

export const hydrate = (vnode: VNode, container: Container, removeChildren = true) => {
    if (removeChildren) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    render(vnode, container);
};

export const JSXRenderer: JSXRenderFN = (result, container) => {
    if (isString(result))
        return console.error(`${result} is a string. @atomfiy/jsx only accepts vnode structures`);
    hydrate(result, container, true);
};
