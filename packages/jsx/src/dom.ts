import { AtomifyNode, Key, PropsWithChildren } from './types';

export const createVdom = <P>(
    type: string,
    props: P,
    children: AtomifyNode[],
    dom: HTMLElement | null,
    key: Key,
    tag?: number,
) => ({ type, props, children, dom, key, tag });

export const Fragment = (props: PropsWithChildren): AtomifyNode => {
    return props.children;
};
