import { camelCaseToDash, dashToCamelCase } from '@atomify/shared';

import { Component } from '../component';

/**
 * Converts property to an attribute
 * transforms the camel cased prop to dash ex: camelCase -> camel-case
 * @param { string } name
 * @param { any } value
 * @param { Component } component
 */
export const toAttribute = (name: string, value: any, component: Component) => {
    const propName = camelCaseToDash(name);
    const property = propName in component.props ? component.props[propName] : null;
    const type = property && property.type ? property.type : property;
    let convertedValue = value;

    switch (type) {
        case Boolean:
            convertedValue = value ? '' : null;
            break;
        case Object:
        case Array:
            convertedValue = value == null ? value : JSON.stringify(value); // Check if value is undefined or null
            break;
    }

    return {
        name: propName,
        value: convertedValue,
    };
};

/**
 * Converts attribute to a property
 * transforms the dash prop to camel case ex: camel-case -> camelCase
 * @param { string } name
 * @param { any } value
 * @param { Component } component
 */
export const toProperty = (name: string, value: any, component: Component) => {
    const propName = dashToCamelCase(name);
    const property = propName in component.props ? component.props[propName] : null;
    const type = property && property.type ? property.type : property;

    let convertedValue = value;

    switch (type) {
        case Boolean:
            convertedValue = value !== null;
            break;
        case Number:
            convertedValue = value === null ? null : Number(value);
            break;
        case Object:
        case Array:
            convertedValue = JSON.parse(value!);
            break;
    }

    return {
        name: propName,
        value: convertedValue,
    };
};
