import {
    FunctionValue,
    isBooleanAttr,
    isCustomElement,
    isFunction,
    removeAttr,
    setAttr,
} from '../utilities';

const XLINK_NS = 'http://www.w3.org/1999/xlink';

export const applyAttributes = (element: any, vnodeData: object) => {
    const attributes = Object.keys(vnodeData || {});

    attributes.forEach((attribute) => {
        const attributeName = attribute as keyof typeof vnodeData;
        const attributeValue = vnodeData[attributeName];

        let lAttributeName = attribute.toLowerCase();

        switch (attributeName) {
            case 'style':
                Object.assign(element.style, attributeValue);
                return;
            case 'class':
            case 'className':
                if (isFunction(attributeValue)) {
                    (attributeValue as FunctionValue)(element);
                } else {
                    setAttr(element, 'style', attributeValue);
                }
                return;
            case 'htmlFor':
                setAttr(element, 'for', attributeValue);
                return;
            case 'dangerouslySetInnerHTML':
                element.innerHTML = attributeValue;
                return;
        }

        if (isBooleanAttr(attributeName)) {
            if (attributeValue) {
                setAttr(element, attributeName, '');
            } else {
                removeAttr(element, attributeName);
            }
            return;
        } else if (
            isFunction(attributeValue) &&
            attributeName[0] === 'o' &&
            attributeName[1] === 'n'
        ) {
            const eventName = (attributeName as string).substr(2).toLowerCase();
            element.addEventListener(eventName, attributeValue);
        }

        // if (
        //     (isCustomElement(element) &&
        //         !(attributeName as string).includes('-') &&
        //         !isBooleanAttr(attributeName) &&
        //         typeof element.constructor.properties !== 'undefined' &&
        //         element.constructor.properties.has(attributeName)) ||
        //     (element.props && attributeName in element.props)
        // ) {
        //     return (element[attributeName] = attributeValue);
        // } else if (typeof attributeValue !== 'function') {
        //     if (lAttributeName !== (lAttributeName = lAttributeName.replace(/^xlink\:?/, ''))) {
        //         if (attributeValue == null || attributeValue === false) {
        //             return element.removeAttributeNS(XLINK_NS, lAttributeName.toLowerCase());
        //         } else {
        //             return element.setAttributeNS(
        //                 XLINK_NS,
        //                 lAttributeName.toLowerCase(),
        //                 attributeValue,
        //             );
        //         }
        //     } else if (attributeValue == null || attributeValue === false) {
        //         return element.removeAttribute(attributeName);
        //     } else {
        //         const isBooleanValue = typeof attributeValue === 'boolean';
        //         return element.setAttribute(attributeName, isBooleanValue ? '' : attributeValue);
        //     }
        }
    });

    return element;
};
