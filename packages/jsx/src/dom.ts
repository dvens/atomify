import { isFunction, isNullValue, isObject, isString, isSVG } from '@atomify/shared';

import { EMPTY_ARRAY, EMPTY_OBJ, SVG_URI, TEXT_NODE } from './constants';
import { setProperty } from './set-property';
import { ComponentChild, ComponentChildren, FunctionComponent, VNode, VnodeType } from './types';

type ElementNode = null | undefined | HTMLElement | Text | SVGElement;

export const createElement = <P extends object>(
    vnode: VNode<P> | null,
): ElementNode | ElementNode[] => {
    if (isNullValue(vnode)) return null;

    const { type, tag, props, children } = vnode;

    if (isFunction(type)) {
        const fc = type({ ...props, children });
        return createElement(fc);
    }

    if (Array.isArray(vnode)) {
        return vnode.map((c) => createElement(vDomify(c))) as ElementNode[];
    }

    const dom =
        tag === TEXT_NODE && !isFunction(type)
            ? document.createTextNode(type)
            : isString(type) && isSVG(type)
            ? document.createElementNS(SVG_URI, type)
            : document.createElement(type);
    if (!(dom instanceof Text)) {
        setProperty(dom, props);
    }

    // Append children
    if (Array.isArray(children)) {
        children.map((c) => appendChild(c, dom));
    } else if (isObject(children)) {
        appendChild(children, dom);
    }
    return dom;
};

function appendChild(child: ComponentChild, dom: Text | SVGElement | HTMLElement) {
    const createdElement = createElement(vDomify(child)) as HTMLElement;
    const element = isString(createdElement)
        ? document.createTextNode(createdElement)
        : createdElement;

    if (element && !Array.isArray(element)) {
        dom.appendChild(element);
    } else if (Array.isArray(element)) {
        element.forEach((e) => dom.appendChild(e));
    }
}

export const createVnode = <P>(
    type: VnodeType<P>,
    props: P,
    children: ComponentChildren,
    tag?: number,
) => ({ type, props, children, tag });

export const vDomify = (value: any) =>
    value !== true && value !== false && value ? value : text('');

export const text = (value: any) => createVnode(value, EMPTY_OBJ, EMPTY_ARRAY, TEXT_NODE);

export const Fragment: FunctionComponent = (props) => {
    return props.children;
};
