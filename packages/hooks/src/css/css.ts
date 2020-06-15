import { Component } from '../component';
import { CSS_SAVE_TOKEN } from '../symbols';
import { supportsAdoptingStyleSheets } from '../utilities';
import { scopeCSS } from './scope-css';

declare global {
    interface ShadowRoot {
        adoptedStyleSheets: CSSStyleSheet[];
    }

    interface Document {
        adoptedStyleSheets: CSSStyleSheet[];
    }

    interface CSSStyleSheet {
        replaceSync(cssText: string): void;
    }
}

export interface StyleObject {
    token: typeof CSS_SAVE_TOKEN;
    cssText: string;
}

const CSS_CACHE = new Map<string, CSSStyleSheet | string>();
const APPLIED_STYLES: string[] = [];

const isValidCSSResult = (value: StyleObject | number) => {
    if (typeof value !== 'number' && value.hasOwnProperty('cssText')) {
        return value.cssText;
    } else if (typeof value === 'number') {
        return value;
    } else {
        throw new Error(`${value} is not supported. Use 'unsafeCSS' if you want to use: ${value}`);
    }
};

/**
 * Generates the stylesheet and saves it within the CSS_CACHE.
 * @param { style } style
 * @return { HTMLStyleElement }
 */
export const registerStyle = (root: Component, cssText: string) => {
    const hasShadowDom = root.hasShadowDom;
    const componentId = root.$cmpMeta$.$id$;
    let style = CSS_CACHE.get(componentId);

    if (supportsAdoptingStyleSheets && hasShadowDom) {
        style = new CSSStyleSheet() as CSSStyleSheet;
        style.replaceSync(cssText);
    } else {
        style = cssText;
    }

    CSS_CACHE.set(componentId, style);
};

/**
 * CSS template literal being used by the createStylesheet
 * @param {TemplateStringsArray} strings
 * @param {number[]} values
 */
export const css = (
    strings: TemplateStringsArray,
    ...values: (StyleObject | number)[]
): StyleObject => {
    const cssText = values.reduce(
        (acc, value, currentIndex) => acc + isValidCSSResult(value) + strings[currentIndex + 1],
        strings[0],
    );

    return { token: CSS_SAVE_TOKEN, cssText };
};

/**
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 * @param {string} css
 * @returns {StyleObject}
 */
export const unsafeCSS = (cssString: string): StyleObject => ({
    token: CSS_SAVE_TOKEN,
    cssText: cssString,
});

/**
 * Applies adoptedStyleSheets to the Atomify component.
 * @param { Component } root
 * @param { StyleObject } css
 */
export const addStyle = (root: Component, token: symbol) => {
    if (token !== CSS_SAVE_TOKEN) {
        throw new Error('The CSS result is not allowed. Use `unSafeCSS` or `CSS`');
    }

    const hasShadowDom = root.hasShadowDom;
    const componentName = root.$cmpMeta$.$tagName$;
    const style = CSS_CACHE.get(root.$cmpMeta$.$id$);

    if (!style) throw new Error(`No CSS available for: ${componentName}`);

    // Add addopted stylesheets when it is supported
    if (supportsAdoptingStyleSheets && hasShadowDom && style instanceof CSSStyleSheet) {
        // Apply the adopted stylesheet to the document when the shadowdom is false.
        const CSSRoot = root.container;
        if (!(CSSRoot instanceof HTMLElement) && !CSSRoot.adoptedStyleSheets.includes(style)) {
            CSSRoot.adoptedStyleSheets = [...CSSRoot.adoptedStyleSheets, style];
        }
    } else if (typeof style === 'string') {
        const styles = document.createElement('style');
        styles.textContent = hasShadowDom ? style : scopeCSS(componentName, style);

        // Save the styles of the component.
        root.styles = style;

        // When adopted stylesheet is not supported but shadow dom is apply it to the shadow root.
        // Else it is being applied to the head.
        if (hasShadowDom) {
            root.container.appendChild(styles);
        } else if (APPLIED_STYLES.indexOf(componentName) === -1) {
            document.head.appendChild(styles);
            APPLIED_STYLES.push(componentName);
        }
    }
};
