import { QueryTarget,RenderRoot } from '../declarations';

/**
 * Queries the render root ( this or the shadowdom ) from a custom element
 * And binds the selector to the custom element.
 * @param selector
 * @param queryAll
*/
function select( selector: string, queryAll: boolean = false, target?: QueryTarget ) {

    return ( propertyTarget: Record<string, any>, propertyName: PropertyKey ): any => {

        const descriptor = {

            get( this: RenderRoot ) {

                const targetElement = target ? target : this.renderRoot;

                return ( queryAll )
                    ? targetElement.querySelectorAll(selector)
                    : targetElement.querySelector(selector);

            },

            enumerable: true,
            configurable: true,

        };

        return Object.defineProperty(propertyTarget, propertyName, descriptor);

    };

}

/**
 * Queries and returns a single element.
 * @param selector name of the selector that has to be queried.
*/
export const Query = ( selector: string, target?: QueryTarget ) => {

    return select( selector, false, target );

};

/**
 * Queries and returns a list of dom elements.
 * @param selector name of the selector that has to be queried
*/
export const QueryAll = ( selector: string, target?: QueryTarget ) => {

    return select( selector, true, target );

};