import { isCSSStyleHook, isNullValue, isString } from '@atomify/shared';

import { createDom } from './dom';
import { Container, VNode } from './types';

type JSXRenderFN<C = any> = (
    result: VNode | string,
    container: HTMLElement | ShadowRoot,
    name: string,
    component: C,
) => void;

export const render = (vnode: VNode, container: Container) => {
    if (isNullValue(vnode)) return;

    const dom = createDom(vnode);

    if (dom) {
        container.appendChild(dom);
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

export const hydrateCustomElement = (
    vnode: VNode,
    container: Container,
    removeChildren = false,
) => {
    if (removeChildren) {
        const children = Array.from(container.childNodes).filter((child) => !isCSSStyleHook(child));

        if (children.length > 0) {
            children.forEach((child) => child.remove());
        }
    }

    render(vnode, container);
};

export const JSXRenderer: JSXRenderFN = (result, container, _, component) => {
    if (isString(result))
        return console.error(`${result} is a string. @atomfiy/jsx only accepts vnode structures`);
    hydrateCustomElement(result, container, component.$cmpMeta$.$clearElementOnUpdate$);

    if (!component.$cmpMeta$.$clearElementOnUpdate$)
        component.$cmpMeta$.$clearElementOnUpdate$ = true;
};
