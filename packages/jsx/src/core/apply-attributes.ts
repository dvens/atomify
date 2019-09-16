import { isCustomElement } from '../utilities';

export const applyAttributes = ( element: any, vnodeData: object ) => {

    const attributes = Object.keys( vnodeData || {} );

    if( isCustomElement( element ) && !element.__jsxProps ) {

        element.__jsxProps = new Map();

    }

    attributes.forEach(( attribute ) => {

        const prop = (attribute as keyof typeof vnodeData);

        if( prop === 'style' ) {

            return Object.assign( element.style, vnodeData[prop] )

        } else if ( prop === 'class' || prop === 'className' ) {

            return element.setAttribute('class', vnodeData[prop] );

        } else if ( prop === 'htmlFor' ) {

            return element.setAttribute('for', vnodeData[prop]);

        } else if ( ( prop as string ).indexOf('on') === 0 ) {

            const eventName = ( prop as string ).substr(2).toLowerCase();
            return element.addEventListener( eventName, vnodeData[prop] );

        } else if( isCustomElement( element ) && !( prop as string ).includes('-') ) {

            if( !element.__jsxProps.has( prop ) ) {

                return element.__jsxProps.set( prop, vnodeData[prop] );

            }

        } else if( prop === 'dangerouslySetInnerHTML' ) {

            return element.innerHTML = vnodeData[prop];

        } else {

            return element.setAttribute(prop, vnodeData[prop]);

        }

    });

    return element;

};