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

export const h = <P>(
    type: VnodeType<P>,
    props: Props<P>,
    ...children: ComponentChildren
): VNode<P> => {
    const properties: P = Object.assign({}, props) || (EMPTY_OBJ as P);

    const hasChildren = children.length > 0;

    const rawChildren = hasChildren ? ([] as ComponentChildren).concat(...children) : [];

    const mappedChildren = rawChildren.map((node) =>
        isString(node) || isNumber(node) ? text(node) : node,
    );

    return createVnode(type, properties, mappedChildren);
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
    text,
};
