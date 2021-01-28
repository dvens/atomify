import { supportsAdoptingStyleSheets } from '@atomify/shared';

import { Component } from '../component';
import { CSS_SAVE_TOKEN } from '../symbols';
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

export interface CSSResult {
    cssText: string;
    styleSheet: CSSStyleSheet | null;
}

export type CSSResultOrNative = CSSResult | CSSStyleSheet;

const APPLIED_STYLES: string[] = [];

const isValidCSSResult = (value: StyleObject | number) => {
    if (typeof value === 'number') {
        return value;
    } else if ('cssText' in value) {
        return value.cssText;
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
): CSSResult => {
    const cssText = values.reduce(
        (acc, value, currentIndex) => acc + isValidCSSResult(value) + strings[currentIndex + 1],
        strings[0],
    );

    return createCSSResult(cssText, CSS_SAVE_TOKEN);
};

/**
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 * @param {string} css
 * @returns {StyleObject}
 */
export const unsafeCSS = (cssString: unknown): CSSResult =>
    createCSSResult(String(cssString), CSS_SAVE_TOKEN);

/**
 * @param {string} css
 * @param {symbol} token
 * @returns {({ cssText: string; styleSheet: CSSStyleSheet | null })}
 */
const createCSSResult = (
    css: string,
    token: symbol,
): { cssText: string; styleSheet: CSSStyleSheet | null } => {
    if (token !== CSS_SAVE_TOKEN)
        throw new Error(`${css} is not supported. Use 'unsafeCSS' if you want to use: ${css}`);

    let styleSheet: CSSStyleSheet | null = null;
    const cssText = css;

    if (supportsAdoptingStyleSheets) {
        styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(cssText);
    }

    return {
        cssText,
        styleSheet,
    };
};

/**
 * Applies adoptedStyleSheets to the Atomify component.
 * @param { Component } root
 * @param { StyleObject } css
 */
export const adoptStyles = (root: Component, styles: Array<CSSResultOrNative>) => {
    const hasShadowDom = root.hasShadowDom;
    const componentName = root.$cmpMeta$.$tagName$;

    // Add addopted stylesheets when it is supported
    if (supportsAdoptingStyleSheets && hasShadowDom) {
        const CSSRoot = root.container;
        if (!(CSSRoot instanceof HTMLElement))
            CSSRoot.adoptedStyleSheets = styles.map((s) => {
                return s instanceof StyleSheet ? s : s.styleSheet!;
            });
    } else if (APPLIED_STYLES.indexOf(componentName) === -1) {
        const combinedStyleArray = styles
            .map((style) => ('cssText' in style ? style.cssText : null))
            .join('');

        const scopedCSS = hasShadowDom
            ? combinedStyleArray
            : scopeCSS(componentName, combinedStyleArray);

        const styleElement = document.createElement('style');
        styleElement.textContent = scopedCSS;
        styleElement.setAttribute('scope', componentName);

        // When adopted stylesheet is not supported but shadow dom is apply it to the shadow root.
        // Else it is being applied to the head.
        if (hasShadowDom) {
            // Cache the styles so it can be reused instead of creating a style tag again.
            root.styles = scopedCSS;
        } else {
            document.head.appendChild(styleElement);
            APPLIED_STYLES.push(componentName);
        }
    }
};
