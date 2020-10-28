import { createVnode, Fragment, text } from './dom';
import { render } from './render';
import { ComponentChildren, FunctionComponent, Props, VNode, VnodeType } from './types';
import { classNames, isFunction, isNumber, isString } from './utilities';

export declare namespace h {
    export namespace JSX {
        interface IntrinsicElements {
            [tagName: string]: any;
        }
    }
}

export const h = <P extends object>(
    type: VnodeType<P>,
    props: Props<P>,
    ...children: ComponentChildren[]
): VNode<P> | null => {
    const properties = props || ({} as P);
    const mappedChildren = children.map((node) =>
        isString(node) || isNumber(node) ? text(node) : node,
    );

    if (isFunction(type)) {
        return type({
            ...properties,
            children: mappedChildren.length === 1 ? mappedChildren[0] : mappedChildren,
        });
    }

    return createVnode(
        type,
        properties,
        mappedChildren.length === 1 ? mappedChildren[0] : mappedChildren,
    );
};

export { classNames, Fragment, render, FunctionComponent };
