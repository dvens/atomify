import { Ref } from '../utilities';

export type Key = string | number | null | undefined;

export interface Props {
    key?: Key;
    children?: AtomifyNode;
    ref?: Ref;
}

export interface FC<P extends Props = {}> {
    (props: P): AtomifyElement<P> | null;
}

export interface AtomifyElement<P extends Props = any, T = string> {
    type: T;
    props: P;
}

export interface Vnode<P extends Props = any> {
    key?: string;
    type: string | FC<P>;
    node: HTMLElement;
    children?: Vnode<P>;
    parent?: Vnode<P>;
    props: P;
    oldProps?: P;
}

export type AtomifyNode = Key | AtomifyElement | Vnode[] | boolean | null | undefined;

export interface PropsWithChildren {
    children?: AtomifyNode;
}
