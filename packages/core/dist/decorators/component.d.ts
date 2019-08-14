import { ComponentOptions, CustomElementConstructor } from '../declarations';
/**
* Base Component decorator that creates a custom element on the fly.
* Developers must provide a tag name for the component.
*
* @param tag the name of the custom element to define
* @param style inline style
* @param styles multiple inline styles
* @param shadow opt_in for putting shadow dom on true ( default is false )
*
*   Example:
*   @Component({
*       tag: 'example-element',
        style: '.div { display: none; }',
        styles: ['.div { display: none; }', '.logo { display: block }'],
        shadow: true
*   })
*   export class ExampleElement extends HTMLElement {
*
*   }
*/
export declare const Component: (options: ComponentOptions) => <T extends CustomElementConstructor>(constructor: T) => T;
//# sourceMappingURL=component.d.ts.map