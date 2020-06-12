import { Component } from '../component/component';
import { CSS_SAVE_TOKEN } from '../symbols';
import { supportsAdoptingStyleSheets } from '../utilities';

const isValidCSSResult = (value: string | number) => {
    if (typeof value === 'string' || typeof value === 'number') {
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
export const css = (strings: TemplateStringsArray, ...values: number[]) => {
    const cssText = values.reduce(
        (acc, value, currentIndex) => acc + isValidCSSResult(value) + strings[currentIndex + 1],
        strings[0],
    );

    return { token: CSS_SAVE_TOKEN, cssText };
};

export const createStylesheet = (root: Component, css: { token: symbol; cssText: string }) => {
    if (css.token !== CSS_SAVE_TOKEN) {
        throw new Error('The CSS result is not allowed. Use `unSafeCSS` or `CSS`');
    }

    const hasShadowDom = root.hasShadowDom;

    if (supportsAdoptingStyleSheets) {
        const CSSRoot = hasShadowDom ? root.container : document;
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(css.cssText);

        if (!(CSSRoot instanceof HTMLElement) && !CSSRoot.adoptedStyleSheets.includes(stylesheet)) {
            CSSRoot.adoptedStyleSheets = [...CSSRoot.adoptedStyleSheets, stylesheet];
        }
    } else {
        const styles = document.createElement('style');
        styles.innerText = css.cssText;

        if (hasShadowDom) {
            root.container.appendChild(styles);
        } else {
            document.head.appendChild(styles);
        }
    }
};

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
