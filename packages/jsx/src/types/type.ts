import { Ref } from '../utilities';

export type VnodeType<P = any> = string | FunctionComponent<P>;
export interface VNode<P extends object = {}> {
    type: VnodeType<P>;
    children?: ComponentChildren;
    props: P;
    tag?: number;
}

export interface FunctionComponent<P = any> {
    (props: Props<P>): VNode<any> | null;
    defaultProps?: Partial<P>;
}

export type Props<P> = P & { children?: ComponentChildren; ref?: Ref };

export interface PropsWithChildren {
    children?: ComponentChildren;
}

export type ComponentChild = VNode<any> | object | string | number | boolean | null | undefined;

export type ComponentChildren = ComponentChild[] | ComponentChild;
