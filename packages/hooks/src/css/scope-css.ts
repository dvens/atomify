/**
 * Scope CSS cache map
 */
const SCOPE_STYLE_CACHE = new Map<string, string>();

/**
 * Host selector regex
 */
const HOST_REGEX = /:host(\(([^({)]+(\([^)]*\))?)+\))?/g;

/**
 * CSS selector regex
 */
const CSS_SELECTORS_REGEX = /(#|\*|\.|@|\[|[a-zA-Z])([^{;}]*){/g;

/**
 * Scopes a CSS string when shadowdom is not available.
 * @param {string} name
 * @param {string} cssText
 * @return {string}
 */
export const scopeCSS = (name: string, cssText: string): string => {
    if (SCOPE_STYLE_CACHE.has(name)) {
        const cachedStyle = SCOPE_STYLE_CACHE.get(name);
        return typeof cachedStyle !== 'undefined' ? cachedStyle : '';
    }

    const componentName = name;
    const scopedCSS = cssText
        .replace(HOST_REGEX, (_, mod) => `${componentName}${mod ? mod.slice(1, -1) : ''}`)
        .replace(CSS_SELECTORS_REGEX, (match) => {
            match = match.trim();
            if (match[0] === '@') {
                return match;
            }
            return match
                .split(',')
                .map((selector) => {
                    selector = selector.trim();
                    if (selector.indexOf(componentName) === 0) {
                        return selector;
                    }
                    return `${componentName} ${selector}`;
                })
                .join(',');
        });

    SCOPE_STYLE_CACHE.set(name, scopedCSS);

    return scopedCSS;
};
