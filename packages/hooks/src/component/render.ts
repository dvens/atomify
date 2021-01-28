import { supportsAdoptingStyleSheets } from '@atomify/shared';

import { bindShadyRoot, supportShadyCSS } from '../utilities';
import { Component, Container } from './component';

export type RenderFunction = (
    result: unknown,
    container: Container,
    name: string,
    component: Component,
) => void;

interface TemplateCache {
    template: HTMLTemplateElement;
    isTemplateString: boolean;
    isJSXresult: boolean;
}

const templateCache = new Map<string, TemplateCache>();

/**
 * Used when no renderer is available or set within the Component option
 * @export
 * @param {unknown} result
 * @param {(Element)} container
 * @param {string} name
 */
export const defaultRenderer: RenderFunction = (result, container, name, component) => {
    // Check if the template is already saved within the template cache
    // Create a template cache when its not defined and apply the result to the element.
    if (!templateCache.has(name)) {
        const template = document.createElement('template');
        const hasStringResult = typeof result === 'string';
        const isTemplateString = hasStringResult || component.styles !== '';
        const isJSXresult = typeof result === 'object';

        // Styles are being reused when the component supports shadowDom but not constructed stylesheets.
        template.innerHTML = `
            ${
                component.hasShadowDom && !supportsAdoptingStyleSheets && component.styles
                    ? `<style>${component.styles}</style>`
                    : ''
            }
            ${hasStringResult ? result : ''}
        `;

        const options = {
            template,
            isTemplateString,
            isJSXresult,
        };
        templateCache.set(name, options);
        setTemplate(container, options, result, component);
    } else {
        const template = templateCache.get(name);
        if (template) setTemplate(container, template, result, component);
    }
};

/**
 * Apply the template result to the component
 * @param {(DocumentFragment | Element)} container
 * @param {TemplateCache} templateCache
 */
const setTemplate = (
    container: Container,
    templateCache: TemplateCache,
    result: unknown,
    component: Component,
) => {
    const { template, isJSXresult, isTemplateString } = templateCache;

    // Apply polyfill when shady polyfill is available and the component has shadowdom
    if (supportShadyCSS && component.hasShadowDom) {
        bindShadyRoot(component, template);
    }

    if (component.$cmpMeta$.$clearElementOnUpdate$) {
        container.innerHTML = '';
    }

    if (isTemplateString) {
        container.appendChild(document.importNode(template.content, true));
    }

    if (isJSXresult) {
        container.appendChild(result as Node);
    }

    // Set clear element on true because we do not make use of a vDom.
    if (!component.$cmpMeta$.$clearElementOnUpdate$) {
        component.$cmpMeta$.$clearElementOnUpdate$ = true;
    }
};
