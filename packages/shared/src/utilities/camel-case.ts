export const camelCaseToDash = (string: string) =>
    string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const dashToCamelCase = (string: string) =>
    string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
