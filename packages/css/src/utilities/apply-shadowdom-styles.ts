import { Component } from '@atomify/hooks';
import { supportsAdoptingStyleSheets } from '@atomify/shared';

import { bindShadyRoot } from './bind-shady-css';
import { supportShadyCSS } from './support-shady-css';

const styleCache = new Map<string, HTMLTemplateElement>();

export const applyShadowdomStyles = (component: Component, styles: string) => {
    const container = component.container;
    const componentName = component.$cmpMeta$.$tagName$;
    let styleTmp: HTMLTemplateElement | undefined;

    if (!styleCache.has(componentName)) {
        styleTmp = document.createElement('template');

        styleTmp.innerHTML = `${
            component.hasShadowDom && !supportsAdoptingStyleSheets() && styles
                ? `<style style-hook>${styles}</style>`
                : ''
        }`;
    } else {
        styleTmp = styleCache.get(componentName);
    }

    if (styleTmp) {
        // Apply polyfill when shady polyfill is available and the component has shadowdom
        if (supportShadyCSS && component.hasShadowDom) {
            bindShadyRoot(component, styleTmp);
        }

        container.appendChild(document.importNode(styleTmp.content, true));
    }
};
