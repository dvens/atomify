import {
    isBoolean,
    isFunction,
    isNullValue,
    isNumber,
    isObject,
    isString,
    isSVG,
} from '@atomify/shared';

import { EMPTY_ARRAY, EMPTY_OBJ, SVG_URI, TEXT_NODE } from './constants';
import { setProperty } from './set-property';
import { ComponentChildren, FunctionComponent, VNode, VnodeType } from './types';

type ElementNode = null | undefined | HTMLElement | Text | SVGElement;

export const createElement = <P extends object>(vnode: VNode<P> | null): ElementNode => {
    if (isNullValue(vnode)) return null;

    const { type, tag, props } = vnode;
    const dom =
        tag === TEXT_NODE && !isFunction(type)
            ? document.createTextNode(type)
            : isString(type) && isSVG(type)
            ? document.createElementNS(SVG_URI, type)
            : document.createElement(type as string);

    if (!(dom instanceof Text)) {
        setProperty(dom, props);
    }

    return dom;
};

export const createDom = <P extends object>(
    vnode: VNode<P> | VNode<P>[] | null,
): ElementNode | DocumentFragment => {
    if (isNullValue(vnode)) return null;

    let dom = null;

    if (Array.isArray(vnode)) {
        dom = document.createDocumentFragment();
        appendChildren(dom, vnode || []);
    } else if (isString(vnode.type)) {
        dom = createElement(vnode);
        appendChildren(dom, vnode.children || []);
    } else if (isFunction(vnode.type)) {
        const fc = vnode.type({ ...vnode.props, children: vnode.children });
        dom = createDom(fc);
    } else {
        return dom;
    }

    return dom;
};

function appendChildren(parentNode: ElementNode | DocumentFragment, children: ComponentChildren) {
    children.forEach((child) => {
        let childnode: ElementNode | DocumentFragment | null = null;

        if (isNullValue(child)) {
            return;
        } else if (isObject(child) && 'type' in child) {
            childnode = createDom(child);
        } else if (isString(child) || isNumber(child)) {
            childnode = document.createTextNode(`${child}`);
        } else if (isBoolean(child) || isNullValue(child)) {
            return;
        } else if (Array.isArray(child)) {
            appendChildren(parentNode, child);
            return;
        }

        if (childnode) {
            parentNode!.appendChild(childnode);
        }

        return childnode;
    });
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
