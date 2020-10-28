import { EMPTY_ARRAY, EMPTY_OBJ, SVG_URI, TEXT_NODE } from './constants';
import { ComponentChildren, PropsWithChildren, VNode, VnodeType } from './types';
import { updateAttributes } from './update-attributes';
import { isFunction, isObject, isString, isSVG } from './utilities';

export const createElement = <P extends object>(vnode: VNode<P>) => {
    const { type, tag, props, children } = vnode;

    const dom =
        tag === TEXT_NODE && !isFunction(type)
            ? document.createTextNode(type)
            : isString(type) && isSVG(type)
            ? document.createElementNS(SVG_URI, type)
            : document.createElement(type as string);

    if (!(dom instanceof Text)) {
        updateAttributes(dom, props);
    }

    if (Array.isArray(children)) {
        children.map((child) => dom.appendChild(createElement(vDomify(child))));
    } else if (isObject(children)) {
        dom.appendChild(createElement(vDomify(children)));
    }

    return dom;
};

export const createVnode = <P>(
    type: VnodeType<P>,
    props: P,
    children: ComponentChildren,
    tag?: number,
) => ({ type, props, children, tag });

export const vDomify = (value: any) =>
    value !== true && value !== false && value ? value : text('');

export const text = (value: any) => createVnode(value, EMPTY_OBJ, EMPTY_ARRAY, TEXT_NODE);

export const Fragment = (props: PropsWithChildren): ComponentChildren => {
    return props.children;
};
