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
export const addStyle = (root: Component, token: symbol, cssText: string) => {
    if (token !== CSS_SAVE_TOKEN) {
        throw new Error('The CSS result is not allowed. Use `unSafeCSS` or `CSS`');
    }

    const hasShadowDom = root.hasShadowDom;
    const componentName = root.$cmpMeta$.$tagName$;

    // Add addopted stylesheets when it is supported
    if (supportsAdoptingStyleSheets && hasShadowDom) {
        // Apply the adopted stylesheet to the document when the shadowdom is false.
        const CSSRoot = root.container;
        const style = new CSSStyleSheet() as CSSStyleSheet;
        style.replaceSync(cssText);

        if (!(CSSRoot instanceof HTMLElement) && !CSSRoot.adoptedStyleSheets.includes(style)) {
            CSSRoot.adoptedStyleSheets = [...CSSRoot.adoptedStyleSheets, style];
        }
    } else if (typeof cssText === 'string' && APPLIED_STYLES.indexOf(componentName) === -1) {
        const styles = document.createElement('style');
        styles.textContent = hasShadowDom ? cssText : scopeCSS(componentName, cssText);

        // When adopted stylesheet is not supported but shadow dom is apply it to the shadow root.
        // Else it is being applied to the head.
        if (hasShadowDom) {
            // Cache the styles so it can be reused instead of creating a style tag again.
            root.styles = cssText;
            root.container.appendChild(styles);
        } else {
            document.head.appendChild(styles);
            APPLIED_STYLES.push(componentName);
        }
    }
};
