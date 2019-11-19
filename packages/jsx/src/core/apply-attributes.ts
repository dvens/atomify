import { isCustomElement } from '../utilities';

const BOOLEAN_ATTRS = [
    'async',
    'allowfullscreen',
    'allowpaymentrequest',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'multiple',
    'muted',
    'novalidate',
    'nowrap',
    'open',
    'readonly',
    'required',
    'reversed',
    'selected',
    'playsinline',
];

export const applyAttributes = ( element: any, vnodeData: object ) => {

    const attributes = Object.keys( vnodeData || {} );

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

        } else if(
            isCustomElement( element ) &&
            !( prop as string ).includes('-') &&
            !BOOLEAN_ATTRS.includes(prop) &&
            typeof element.constructor.properties !== 'undefined' &&
            element.constructor.properties.has(prop)
        ) {

            return element[prop] = vnodeData[prop];

        } else if( prop === 'dangerouslySetInnerHTML' ) {

            return element.innerHTML = vnodeData[prop];

        } else if( BOOLEAN_ATTRS.includes(prop) ) {

            if(vnodeData[prop]) {

                return element.setAttribute(prop, '');

            } else {

                return element.removeAttribute(prop);

            }

        } else if( typeof vnodeData[prop] !== 'function' ) {
            const isStringValue = typeof vnodeData[prop] === 'string';
            return element.setAttribute(prop, isStringValue ? vnodeData[prop] : '');
        }

    });

    return element;

};