import { VNode } from './types';

export function patch(vnode1: VNode, vnode2: VNode) {
    if (vnode1.tag === vnode2.tag) {
    } else {
        // replace node
    }
}
