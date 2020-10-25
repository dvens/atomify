import { createVdom, Fragment } from './dom';
import { AtomifyNode, Props } from './types';
import { classNames } from './utilities';

const EMPTY_ARRAY: Array<any> = [];

// FRE for types
// Logic from domchec/jsxdom
// rendeer of uperfine
export declare namespace h {
    export namespace JSX {
        interface IntrinsicElements {
            [tagName: string]: any;
        }
    }
}

export const h = <P extends Props = {}>(nodeName: string, props: P, children: AtomifyNode) => {
    const properties = props || ({} as P);
    const key = properties.key || null;

    return createVdom(
        nodeName,
        properties,
        Array.isArray(children) ? children : children == null ? EMPTY_ARRAY : [children],
        null,
        key,
    );
};

export { classNames, Fragment };
