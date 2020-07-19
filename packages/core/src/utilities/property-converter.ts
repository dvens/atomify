import { ConvertedOptions, PropertyConverter, TypeHint } from '../declarations';
import { camelCaseToDash, dashToCamelCase } from './camel-case';

export const propertyConverter: PropertyConverter = {
    toAttribute(name: string, value: any, type?: TypeHint): ConvertedOptions {
        const valueType = type ? type : getTypeOfValue(value);
        const convertedPropertyToAttributeName = camelCaseToDash(name);

        let convertedValue = value;

        switch (valueType) {
            case 'Boolean':
                convertedValue = value ? '' : null;
                break;
            case 'Object':
            case 'Array':
                convertedValue = value == null ? value : JSON.stringify(value); // Check if value is undefined or null
                break;
        }

        return {
            value: convertedValue,
            name: convertedPropertyToAttributeName,
        };
    },

    toProperty(name: string, value: any, type?: TypeHint): ConvertedOptions {
        const valuetype = type ? type : getTypeOfValue(value);
        const convertedAttributeToPropertyName = dashToCamelCase(name);

        let convertedValue = value;

        switch (valuetype) {
            case 'Boolean':
                convertedValue = value !== null;
                break;
            case 'Number':
                convertedValue = value === null ? null : Number(value);
                break;
            case 'Object':
            case 'Array':
                convertedValue = JSON.parse(value!);
                break;
        }

        return {
            value: convertedValue,
            name: convertedAttributeToPropertyName,
        };
    },
};

function getTypeOfValue(value: any) {
    if (typeof value === 'object' && !Array.isArray(value)) {
        return 'Object';
    }

    if (Array.isArray(value)) {
        return 'Array';
    }

    if (typeof value === 'boolean') {
        return 'Boolean';
    }

    if (typeof value === 'number') {
        return 'Number';
    }

    return 'String';
}
