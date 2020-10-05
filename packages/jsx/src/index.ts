import { classNames } from './utilities';

declare namespace h {
    export namespace JSX {
        interface IntrinsicElements {
            [tagName: string]: any;
        }
    }
}

const Fragment = DocumentFragment;
export const createElement = (nodeName: string, vnodeData: object, ...children: any) => {
    console.log(nodeName, vnodeData, children);
    // const element = createElement(nodeName, vnodeData, children);
    // const isNotFunctionalComponent = !(
    //     typeof nodeName === 'function' && nodeName !== DocumentFragment
    // );

    // if (isNotFunctionalComponent) {
    //     const fragment = createFragementFromChildren(children);
    //     element.appendChild(fragment);
    // }

    // return isNotFunctionalComponent ? applyAttributes(element, vnodeData) : element;
};

export { classNames, createElement as h, Fragment };
