import { VNode } from '@atomify/jsx';
import { isFunction } from '@atomify/shared';
const DOMAttributeNames: Record<string, string> = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule',
};

export const vnodeToElement = ({ type, props, children }: VNode<any>) => {
    if (isFunction(type)) return null;
    const element = document.createElement(type);

    for (const p in props) {
        if (!props.hasOwnProperty(p)) continue;
        if (p === 'children' || p === 'dangerouslySetInnerHTML') continue;

        if (props[p as keyof typeof props] === undefined) continue;

        const attr = DOMAttributeNames[p] || p.toLowerCase();
        element.setAttribute(attr, props[p as keyof typeof props]);
    }

    const { dangerouslySetInnerHTML = null } = props;
    if (dangerouslySetInnerHTML) {
        element.innerHTML = dangerouslySetInnerHTML || '';
    } else if (children) {
        element.textContent =
            typeof children === 'string'
                ? children
                : Array.isArray(children)
                ? children.join('')
                : '';
    }

    return element;
};
