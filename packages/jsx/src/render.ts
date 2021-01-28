import { isNullValue } from '@atomify/shared';

import { createElement } from './dom';
import { Container, VNode } from './types';

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
