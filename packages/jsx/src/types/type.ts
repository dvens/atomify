import { RefObject } from '@atomify/shared';

export type VnodeType<P = any> = string | FunctionComponent<P>;
export interface VNode<P = any> {
    type: VnodeType<P>;
    children?: ComponentChildren;
    props: P;
    tag?: number;
    element?: Text | SVGElement | HTMLElement;
}

export interface FunctionComponent<P = any> {
    (props: Props<P>): VNode<any> | null;
}

export type Props<P> = P & { children?: ComponentChildren; ref?: RefObject<any> };

export interface PropsWithChildren {
    children?: ComponentChildren;
}

export type ComponentChild = VNode<any> | object | string | number | boolean | null | undefined;

export type ComponentChildren = ComponentChild[] | ComponentChild;
export type Container = Element | Document | ShadowRoot | DocumentFragment | HTMLElement;
