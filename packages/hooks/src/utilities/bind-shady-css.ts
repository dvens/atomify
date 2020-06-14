import { Component } from '../component';

declare global {
    interface Window {
        ShadyCSS: any;
    }
}
/**
 * Generates a template based necessary fallbacks needed for browsers that do not support Custom elements or ShadowDom
 * Reference: https://github.com/webcomponents/webcomponentsjs
 * @param {Component} target
 * @param {HTMLTemplateElement} template
 */
export function bindShadyRoot(target: Component, template: HTMLTemplateElement) {
    window.ShadyCSS.prepareTemplate(template, target.$cmpMeta$.$tagName$);
    window.ShadyCSS.styleElement(target);
}
