import { Component } from './component';

export type FC = ({ element }: { element: Component; update: () => void }) => unknown;
export type RenderFunction = (
    result: unknown,
    container: DocumentFragment | Element,
    name: string,
) => void;

interface TemplateCache {
    template: HTMLTemplateElement;
    result: object | string | null;
    isTemplateString: boolean;
    isJSXresult: boolean;
}

const templateCache = new Map<string, TemplateCache>();

/**
 * Used when no renderer is available or set within the Component option
 * @export
 * @param {unknown} result
 * @param {(DocumentFragment | Element)} container
 * @param {string} name
 */
export const defaultRenderer: RenderFunction = (result, container, name) => {
    // Check if the template is already saved within the template cache
    // Create a template cache when its not defined and apply the result to the element.
    if (!templateCache.has(name)) {
        const template = document.createElement('template');
        const isTemplateString = typeof result === 'string';
        const isJSXresult = typeof result === 'object';
        const templateResult =
            typeof result === 'object' || typeof result === 'string' ? result : null;

        template.innerHTML = `${isTemplateString ? result : ''}`;

        const options = {
            template,
            result: templateResult,
            isTemplateString,
            isJSXresult,
        };
        templateCache.set(name, options);
        setTemplate(container, options);
    } else {
        const template = templateCache.get(name);
        template && setTemplate(container, template);
    }
};

/**
 * Apply the template result to the component
 * @param {(DocumentFragment | Element)} container
 * @param {TemplateCache} templateCache
 */
const setTemplate = (container: DocumentFragment | Element, templateCache: TemplateCache) => {
    const component = container as Component;
    const { template, result, isTemplateString, isJSXresult } = templateCache;

    if (component.connected) {
        component.innerHTML = '';
    }

    if (isTemplateString) {
        container.appendChild(document.importNode(template.content, true));
    }

    if (isJSXresult) {
        container.appendChild(result as Node);
    }
};
