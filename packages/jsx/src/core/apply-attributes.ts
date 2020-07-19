import {
    classNames,
    FunctionValue,
    isBooleanAttr,
    isCustomElement,
    isFunction,
    isNullValue,
    Ref,
    RefFunction,
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
            case 'dataset':
                Object.keys(attributeValue).map((key) => {
                    const value = attributeValue[key];
                    if (value == null) return;
                    element.dataset[key] = value;
                });
                return;
            case 'ref':
                isFunction(attributeValue)
                    ? (attributeValue as RefFunction)(element)
                    : ((attributeValue as Ref).current = element);
                return;
            case 'class':
            case 'className':
                if (isFunction(attributeValue)) {
                    (attributeValue as FunctionValue)(element);
                } else {
                    setAttr(element, 'class', classNames(attributeValue));
                }
                return;
            case 'htmlFor':
                setAttr(element, 'for', attributeValue);
                return;
            case 'dangerouslySetInnerHTML':
                element.innerHTML = attributeValue;
                return;
        }

        if (
            (isCustomElement(element) &&
                !(attributeName as string).includes('-') &&
                !isBooleanAttr(attributeName) &&
                typeof element.constructor.properties !== 'undefined' &&
                element.constructor.properties.has(attributeName)) ||
            (element.props && attributeName in element.props)
        ) {
            element[attributeName] = attributeValue;
        } else if (isBooleanAttr(attributeName)) {
            if (attributeValue) {
                setAttr(element, attributeName, '');
            } else {
                removeAttr(element, attributeName);
            }
        } else if (isFunction(attributeValue)) {
            if (attributeName[0] === 'o' && attributeName[1] === 'n') {
                const eventName = (attributeName as string).substr(2).toLowerCase();
                element.addEventListener(eventName, attributeValue);
            }
        } else if (lAttributeName !== (lAttributeName = lAttributeName.replace(/^xlink\:?/, ''))) {
            if (attributeValue == null || attributeValue === false) {
                element.removeAttributeNS(XLINK_NS, lAttributeName.toLowerCase());
            } else {
                element.setAttributeNS(XLINK_NS, lAttributeName.toLowerCase(), attributeValue);
            }
        } else if (attributeValue === true) {
            setAttr(element, attributeName, '');
        } else if (!isNullValue(attributeValue)) {
            setAttr(element, attributeName, attributeValue);
        }
    });

    return element;
};
