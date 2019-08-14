/**
    * Function that returns initial JSX properties from the ArcherJSX renderer.
*/
export const setInitialPropertyValues = (target, instance) => {
    return new Promise((resolve) => {
        const instanceProperties = instance.constructor.properties;
        if (!instanceProperties || !target.__jsxProps)
            return resolve();
        const jsxProps = target.__jsxProps;
        jsxProps.forEach((propValue, propName) => {
            if (instanceProperties.has(propName)) {
                target[propName] = propValue;
            }
        });
        return resolve();
    });
};
//# sourceMappingURL=set-initial-property-values.js.map