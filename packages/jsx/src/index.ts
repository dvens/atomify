import { classNames, isNumber, isString } from '@atomify/shared';

import { EMPTY_OBJ } from './constants';
import { createVnode, Fragment, text } from './dom';
import { hydrate, JSXRenderer, render } from './render';
import { renderToString } from './render-to-string';
import {
    ComponentChild,
    ComponentChildren,
    FunctionComponent,
    Props,
    VNode,
    VnodeType,
} from './types';

export declare namespace h {
    export namespace JSX {
        interface IntrinsicElements {
            [tagName: string]: any;
        }
    }
}

export const h = <P = any>(
    type: VnodeType<P>,
    props: Props<P>,
    ...children: ComponentChildren[]
): VNode<P> | null => {
    const properties = props || (EMPTY_OBJ as P);
    const mappedChildren = children.map((node) =>
        isString(node) || isNumber(node) ? text(node) : node,
    );

    const flattendChildren = mappedChildren.length === 1 ? mappedChildren[0] : mappedChildren;

    return createVnode(type, properties, flattendChildren);
};

export {
    classNames,
    Fragment,
    render,
    FunctionComponent,
    renderToString,
    JSXRenderer,
    hydrate,
    VnodeType,
    ComponentChildren,
    ComponentChild,
    VNode,
    Props,
    createVnode,
};
