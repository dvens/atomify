export const camelCaseToDash = (string) => {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
export const dashToCamelCase = (string) => {
    return string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};
//# sourceMappingURL=camel-case.js.map