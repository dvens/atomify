import { camelCaseToDash } from '../utilities';
import { attributeToProperty } from '../decorators';
export const attributeChangedCallback = (target, name, oldValue, newValue) => {
    if (oldValue !== newValue) {
        attributeToProperty(target, name, newValue);
    }
};
export const getObservedAttributes = (target) => {
    const props = target.properties;
    const attributes = [];
    if (props) {
        props.forEach((_, key) => attributes.push(camelCaseToDash(key)));
    }
    return attributes;
};
//# sourceMappingURL=attribute-changed-callback.js.map