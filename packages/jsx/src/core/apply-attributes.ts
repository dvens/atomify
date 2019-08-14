import { isCustomElement } from '../utilities';

export const applyAttributes = ( element: any, vnodeData: object ) => {

    const attributes = Object.keys( vnodeData || {} );

    if( isCustomElement( element ) && !element.__jsxProps ) {

        element.__jsxProps = new Map();

    }

    attributes.forEach(( attribute ) => {

        const prop = (attribute as keyof typeof vnodeData);

        if( prop === 'style' ) {

            Object.assign( element.style, vnodeData[prop] )

        } else if ( prop === 'class' || prop === 'className' ) {

            element.setAttribute('class', vnodeData[prop] );

        } else if ( prop === 'htmlFor' ) {

            element.setAttribute('for', vnodeData[prop]);

        } else if ( ( prop as string ).indexOf('on') === 0 ) {

            const eventName = ( prop as string ).substr(2).toLowerCase();
            element.addEventListener( eventName, vnodeData[prop] );

        } else if( isCustomElement( element ) && !( prop as string ).includes('-') ) {

            if( !element.__jsxProps.has( prop ) ) {

                element.__jsxProps.set( prop, vnodeData[prop] );

            }

        } else {

            element.setAttribute(prop, vnodeData[prop]);

        }

    });

    return element;

};