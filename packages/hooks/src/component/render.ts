import { PHASE_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { bindShadyRoot, supportShadyCSS } from '../utilities';
import { Component, Container } from './component';

export type CFE<T = Component> = ({ element }: { element: T; update: () => void }) => unknown;
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
        const isTemplateString = typeof result === 'string';
        const isJSXresult = typeof result === 'object';

        template.innerHTML = `
            ${supportShadyCSS && component.hasShadowDom ? `<style>${component.styles}</style>` : ''}
            ${isTemplateString ? result : ''}
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
    const { template, isTemplateString, isJSXresult } = templateCache;

    // Apply polyfill when shady polyfill is available and the component has shadowdom
    if (supportShadyCSS && component.hasShadowDom) {
        bindShadyRoot(component, template);
    }

    if (component[PHASE_SYMBOL] === UPDATE_SYMBOL) {
        container.innerHTML = '';
    }

    if (isTemplateString) {
        container.appendChild(document.importNode(template.content, true));
    }

    if (isJSXresult) {
        container.appendChild(result as Node);
    }
};
