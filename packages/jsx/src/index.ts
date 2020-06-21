import { applyAttributes, createElement, createFragementFromChildren } from './core';
import { classNames } from './utilities';

export declare namespace h {
    export namespace JSX {
        interface IntrinsicElements {
            [tagName: string]: any;
        }
    }
}

export const h = (nodeName: string, vnodeData: object, ...children: any) => {
    const element = createElement(nodeName, vnodeData, children);
    const isNotFunctionalComponent = !(
        typeof nodeName === 'function' && nodeName !== DocumentFragment
    );

    if (isNotFunctionalComponent) {
        const fragment = createFragementFromChildren(children);
        element.appendChild(fragment);
    }

    return isNotFunctionalComponent ? applyAttributes(element, vnodeData) : element;
};

export const Fragment = DocumentFragment;
export { classNames };
