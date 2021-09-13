import { ComponentChild, FunctionComponent, h, renderToString, VNode } from '@atomify/jsx';
import { isObject, isServer, isString, shallowEqual } from '@atomify/shared';

import { LinkProps, MetaProps } from './head.types';
import { vnodeToElement } from './vnode-to-element';
type Tags = Record<string, VNode[]>;

export interface ConfigObject {
    title?: string;
    base?: {
        href?: string;
        target?: string;
    };
    meta?: MetaProps[];
    link?: LinkProps[];
    script?: any[];
    style?: string;
    noScript?: any[];
}

let tags: Tags = {};

const ACCEPTED_TAG_NAMES = ['meta', 'base', 'link', 'style', 'script'];
const METATYPES = ['name', 'httpEquiv', 'charSet', 'itemProp'];
const ATOMIFY_HEAD = 'atomify-head';

function unique() {
    const base: string[] = [];
    const metaTypes: string[] = [];
    const metaCategories: { [key: string]: string[] } = {};

    return (h: ComponentChild) => {
        const { type, props } = h as VNode;

        switch (type) {
            case 'title':
            case 'base':
                if (base.includes(type)) return false;
                base.push(type);
                break;
            case 'meta':
                for (let i = 0, len = METATYPES.length; i < len; i++) {
                    const metatype = METATYPES[i];
                    if (!props.hasOwnProperty(metatype)) continue;
                    if (metatype === 'charSet') {
                        if (metaTypes.includes(metatype)) return false;
                        metaTypes.push(metatype);
                    } else {
                        const category = props[metatype as keyof typeof props];
                        const categories: string[] =
                            metaCategories[metatype as keyof typeof metaCategories] || [];
                        if (categories.includes(category)) return false;
                        categories.push(category);
                        metaCategories[metatype] = categories;
                    }
                }
                break;
        }
        return true;
    };
}

function updateClient() {
    updateTitle(tags);

    ACCEPTED_TAG_NAMES.forEach((type) => updateElements(type, tags[type] || []));
}

function updateElements(type: string, tags: VNode[]) {
    const headEl = document.getElementsByTagName('head')[0];
    const oldTags = Array.prototype.slice.call(headEl.querySelectorAll(`${type}.${ATOMIFY_HEAD}`));

    const newTags = tags.map(vnodeToElement).filter((newTag) => {
        for (let i = 0, len = oldTags.length; i < len; i++) {
            const oldTag = oldTags[i];
            if (oldTag.isEqualNode(newTag)) {
                oldTags.splice(i, 1);
                return false;
            }
        }
        return true;
    });

    oldTags.forEach((t) => t.parentNode.removeChild(t));
    newTags.forEach((t) => t && headEl.appendChild(t));
}

function updateTitle(tags: Tags) {
    const component = tags.title ? tags.title[0] : null;
    let title;

    if (component) {
        const { children } = component;
        const titleChild = children && children.length > 0 ? children[0] : null;

        title =
            titleChild != null && isObject(titleChild) && 'type' in titleChild
                ? `${(titleChild as VNode).type}`
                : '';
    } else {
        title = '';
    }

    if (title !== document.title) document.title = title;
}

const renderStatic = () => {
    const children = Object.keys(tags).map((tagName) => tags[tagName]);
    tags = {};

    return renderToString(children);
};

const renderAsElements = () => {
    const children = Object.keys(tags).map((tagName) => tags[tagName]);
    tags = {};

    return children.reduce((acc, val) => acc.concat(val), []);
};

const renderObjectToChildren = (props: ConfigObject) => {
    const vnodeMap: (VNode<{}> | null)[] = [];

    Object.keys(props).map((key) => {
        const value = props[key as keyof typeof props];

        switch (key) {
            case 'title':
            case 'style':
                vnodeMap.push(h(key, {}, value));
                break;
            case 'base':
                vnodeMap.push(h(key, value as object, null));
                break;
            default:
                if (Array.isArray(value)) {
                    value.forEach((props) => {
                        vnodeMap.push(h(key, props, null));
                    });
                }
                break;
        }
    });

    return vnodeMap;
};

interface Head extends FunctionComponent {
    renderObjectToChildren: (props: ConfigObject) => (VNode<{}> | null)[];
    renderAsElements: () => VNode<{}>[];
    renderStatic: () => string;
}

export const Head: Head = ({ children }) => {
    const vnodesChildren = Array.isArray(children) ? children : [children];
    const vnodes = vnodesChildren
        .filter((child) => isObject(child))
        .reverse()
        .filter(unique())
        .map((child) => {
            const { props, type, children, tag } = child as VNode<{ className?: string }>;
            const className = (props.className ? props.className + ' ' : '') + ATOMIFY_HEAD;

            return {
                type,
                tag,
                children,
                props: {
                    ...props,
                    className,
                },
            };
        })
        .reverse();

    vnodes.forEach((child) => {
        const { type, props } = child;
        if (!isString(type)) return;
        const components = tags[type] || [];

        // To avoid duplicates.
        const hasChild = components.some((element) => shallowEqual(element.props, props));

        if (!hasChild) {
            components.push(child);
            tags[type] = components;
        }
    });

    if (!isServer) {
        updateClient();
    }

    return null;
};

Head.renderAsElements = renderAsElements;
Head.renderStatic = renderStatic;
Head.renderObjectToChildren = renderObjectToChildren;
