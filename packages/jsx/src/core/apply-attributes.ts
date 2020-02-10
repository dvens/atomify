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

const XLINK_NS = 'http://www.w3.org/1999/xlink';

export const applyAttributes = ( element: any, vnodeData: object ) => {

    const attributes = Object.keys( vnodeData || {} );

    attributes.forEach(( attribute ) => {
        const attributeName = (attribute as keyof typeof vnodeData);
        const attributeValue = vnodeData[attributeName];

        let lAttributeName = attribute.toLowerCase();

        if( attributeName === 'style' ) {

            return Object.assign( element.style, attributeValue )

        } else if ( attributeName === 'class' || attributeName === 'className' ) {

            return element.setAttribute('class', attributeValue );

        } else if ( attributeName === 'htmlFor' ) {

            return element.setAttribute('for', attributeValue);

        } else if ( ( attributeName as string ).indexOf('on') === 0 ) {

            const eventName = ( attributeName as string ).substr(2).toLowerCase();
            return element.addEventListener( eventName, attributeValue );

        } else if(
            isCustomElement( element ) &&
            !( attributeName as string ).includes('-') &&
            !BOOLEAN_ATTRS.includes(attributeName) &&
            typeof element.constructor.properties !== 'undefined' &&
            element.constructor.properties.has(attributeName)
        ) {

            return element[attributeName] = attributeValue;

        } else if( attributeName === 'dangerouslySetInnerHTML' ) {

            return element.innerHTML = attributeValue;

        } else if( BOOLEAN_ATTRS.includes(attributeName) ) {

            if(attributeValue) {

                return element.setAttribute(attributeName, '');

            } else {

                return element.removeAttribute(attributeName);

            }

        } else if( typeof attributeValue !== 'function' ) {
            if (lAttributeName !== (lAttributeName = lAttributeName.replace(/^xlink\:?/, ''))) {

                if (attributeValue == null || attributeValue === false) {

                    return element.removeAttributeNS(
                        XLINK_NS,
                        lAttributeName.toLowerCase()
                    );

                } else {

                    return element.setAttributeNS(
                        XLINK_NS,
                        lAttributeName.toLowerCase(),
                        attributeValue
                    );

                }

            }  else if (attributeValue == null || attributeValue === false) {

                return element.removeAttribute(attributeName);

            } else {

                const isBooleanValue = typeof attributeValue === 'boolean';
                return element.setAttribute(attributeName, isBooleanValue ? '' : attributeValue );

            }
        }

    });

    return element;

};