import {
    camelCaseToDash,
    escapeString,
    isBoolean,
    isBooleanAttr,
    isNumber,
    isObject,
    isString,
    isVoidElement,
    stylesToString,
} from '@atomify/shared';

import { TEXT_NODE } from './constants';
import { ComponentChildren, VNode } from './types';

export const renderToString = (vnode: VNode | ComponentChildren): string => {
    if (vnode == null || typeof vnode === 'boolean') {
        return '';
    } else if (isString(vnode)) {
        return escapeString(vnode);
    } else if (isNumber(vnode)) {
        return String(vnode);
    } else if (Array.isArray(vnode)) {
        let childrenHTML = '';

        vnode.forEach((child) => (childrenHTML += renderToString(child)));

        return childrenHTML;
    } else if (
        'tag' in vnode &&
        vnode.tag === TEXT_NODE &&
        (isString(vnode.type) || isNumber(vnode.type))
    ) {
        return escapeString(String(vnode.type));
    }

    if (isObject(vnode)) {
        const { children, props, type } = vnode as VNode;

        let html = `<${type}`;

        let innerHTML = null;

        // Loop through the props and add the proper string notation.
        for (const prop in props) {
            const value = props[prop as keyof typeof props];

            if (prop === 'children' || prop === 'ref') {
                // We do the check here to get down any further into the if list.
            } else if (prop === 'htmlFor') {
                html += ` for="${value}"`;
            } else if (prop === 'dataset') {
                Object.keys(value).map((datasetName) => {
                    const datasetValue = value[datasetName];
                    const name = camelCaseToDash(datasetName);

                    if (datasetValue != null) {
                        html += ` data-${name}="${datasetValue}"`;
                    }
                });
            } else if (prop === 'class' || prop === 'className') {
                html += value ? ` class="${escapeString(value)}"` : '';
            } else if (prop === 'style') {
                html += ` style="${stylesToString(value)}"`;
            } else if (prop === 'dangerouslySetInnerHTML') {
                innerHTML = value;
            } else {
                if (isBooleanAttr(prop)) {
                    html += value ? ` ${prop}` : '';
                } else if (isString(value)) {
                    html += ` ${prop}="${escapeString(value)}"`;
                } else if (isNumber(value)) {
                    html += ` ${prop}="${String(value)}"`;
                } else if (isBoolean(value)) {
                    html += ` ${prop}="${value}"`;
                }
            }
        }

        // Check if the element is a void element eq: <img />, <input /> etc..
        if (isVoidElement(type)) {
            html += '/>';
        } else {
            html += '>';

            if (innerHTML) {
                html += innerHTML;
            } else if (children) {
                html += renderToString(children);
            }

            html += `</${type}>`;
        }

        return html;
    }

    return '';
};
