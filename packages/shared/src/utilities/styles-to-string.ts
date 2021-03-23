interface CacheObject {
    [key: string]: string;
}

const CACHE: CacheObject = {};
const IS_UNITLESS = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

export function stylesToString(styles: object) {
    let output = '';

    for (let prop in styles) {
        const value = styles[prop as keyof typeof styles];

        if (value != null) {
            const hasUnit = typeof value === 'number' && IS_UNITLESS.test(prop) === false;
            const unit = hasUnit ? 'px' : '';

            prop = CACHE[prop] || (CACHE[prop] = prop.replace(/([A-Z])/g, '-$1').toLowerCase());

            output += `${prop}:${value}:${unit}`;
        }
    }

    return output;
}
