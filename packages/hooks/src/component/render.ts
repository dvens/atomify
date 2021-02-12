import { Component, Container } from './component';

export type RenderFunction = (
    result: unknown,
    container: Container,
    name: string,
    component: Component,
) => void;

type ComponentRender = null | RenderFunction;

const templateCache = new Map<string, HTMLTemplateElement>();

export let componentRender: ComponentRender = null;

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

        template.innerHTML = `
            ${isTemplateString ? result : ''}
        `;

        templateCache.set(name, template);
        setTemplate(container, template, component);
    } else {
        const template = templateCache.get(name);
        if (template) setTemplate(container, template, component);
    }
};

export const setupDefaultRender = (fn: RenderFunction) => {
    componentRender = fn;
    return componentRender;
};

/**
 * Apply the template result to the component
 * @param {(DocumentFragment | Element)} container
 * @param {TemplateCache} templateCache
 */
const setTemplate = (container: Container, template: HTMLTemplateElement, component: Component) => {
    if (component.$cmpMeta$.$clearElementOnUpdate$) {
        container.innerHTML = '';
    }

    container.appendChild(document.importNode(template.content, true));

    // Set clear element on true because we do not make use of a vDom.
    if (!component.$cmpMeta$.$clearElementOnUpdate$) {
        component.$cmpMeta$.$clearElementOnUpdate$ = true;
    }
};
