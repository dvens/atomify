import { ComponentConstructor, ComponentOptions, RenderTemplate } from '../declarations';
import { generateStyles } from '.';

const templateCache = new Map();

/*
 * Generates styling and a template string to render the component.
 * The render template function caches the template and return the template and styling if its cached.
 */
export const renderTemplate = (
    target: ComponentConstructor,
    options: ComponentOptions,
): RenderTemplate => {
    const templateResult = target.render && target.render();
    const isTemplateString = templateResult && typeof templateResult === 'string';

    // Check if styles and template are cached otherwise create a cached template.
    if (!templateCache.has(target.__nodeName)) {
        const generatedStyles = generateStyles(target, options);
        const componentStyles =
            generatedStyles && options.shadow ? `<style>${generatedStyles}</style>` : '';
        const componentTemplate = document.createElement('template');

        templateCache.set(target.__nodeName, {
            styles: generatedStyles,
            template: componentTemplate,
            componentStyles,
        });

        componentTemplate.innerHTML = `
            ${componentStyles}
            ${isTemplateString ? templateResult : ''}
        `;

        // Return styles and template to update the component
        return {
            styles: generatedStyles,
            template: componentTemplate,
            templateResult,
        };
    } else {
        const { styles, template } = templateCache.get(target.__nodeName);

        // Return styles and template to update the component
        return {
            styles,
            template,
            templateResult,
        };
    }
};

export const removeTemplate = (target: any) => {
    return new Promise((resolve) => {
        target.renderRoot.innerHTML = '';
        resolve();
    });
};
