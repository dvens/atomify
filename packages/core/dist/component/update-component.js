import { generateGeneralStyling } from '../component';
import { renderTemplate } from './render-template';
/**
    * Generates a styling string thats being used in the update function of the Component.
    * The string is generated based on the option given in de @Component decorator.
    * @param {ComponentConstructor} target
    * @param {ComponentOptions} options
**/
export const updateComponent = (target, options, reRender = false) => {
    return new Promise(async (resolve) => {
        const { styles, template, templateResult } = renderTemplate(target, options);
        const isJSXResult = templateResult && typeof templateResult === 'object';
        const nodes = document.importNode(template.content, true);
        if (reRender) {
            target.renderRoot.innerHTML = '';
        }
        target.renderRoot.appendChild(nodes);
        if (isJSXResult) {
            target.renderRoot.appendChild(templateResult);
        }
        // Checks if styling and shadow dom is not allowed
        // and adds the styling to the document head.
        if (styles && !options.shadow) {
            generateGeneralStyling(target, styles);
        }
        ;
        // Check if the shadow DOM polyfill is available.
        if (target.__hasShadowdomPolyfill &&
            options.shadow &&
            !document.head.querySelector(`[scope="${target.__nodeName}"]`)) {
            bindShadyRoot(target, template);
        }
        return resolve();
    });
};
export const safeCall = async (target, instance, method) => {
    if (instance && instance[method]) {
        await instance[method].call(target);
    }
};
/**
    * Generates a template based necessary fallbacks needed for browsers that do not support Custom elements or ShadowDom
    * Reference: https://github.com/webcomponents/webcomponentsjs
    * @param {ComponentConstructor} target
    * @param {HTMLTemplateElement} template
 */
function bindShadyRoot(target, template) {
    window.ShadyCSS.prepareTemplate(template, target.__nodeName);
    window.ShadyCSS.styleElement(target);
}
//# sourceMappingURL=update-component.js.map