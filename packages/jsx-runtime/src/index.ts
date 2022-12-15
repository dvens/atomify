import {
    ComponentChild,
    ComponentChildren,
    createVnode,
    Fragment,
    Props,
    text,
    VnodeType,
} from '@atomify/jsx';
import { isNumber, isString } from '@atomify/shared';

const createChildNode = (node: ComponentChild) =>
    isString(node) || isNumber(node) ? text(node) : node;

const jsx = <P = any>(type: VnodeType<P>, props: Props<P>) => {
    const properties = Object.assign({}, props) || ({} as P);

    let normalizedChildren = [] as ComponentChildren;

    if (props.children) {
        normalizedChildren = Array.isArray(props.children)
            ? props.children.map(createChildNode)
            : [createChildNode(props.children)];
    }

    return createVnode(type, properties, normalizedChildren);
};

export { Fragment, jsx, jsx as jsxs, jsx as jsxDEV };
