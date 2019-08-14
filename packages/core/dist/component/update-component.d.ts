import { ComponentConstructor, ComponentOptions } from '../declarations';
/**
    * Generates a styling string thats being used in the update function of the Component.
    * The string is generated based on the option given in de @Component decorator.
    * @param {ComponentConstructor} target
    * @param {ComponentOptions} options
**/
export declare const updateComponent: (target: ComponentConstructor, options: ComponentOptions, reRender?: boolean) => Promise<any>;
export declare const safeCall: (target: ComponentConstructor, instance: any, method: string) => Promise<void>;
//# sourceMappingURL=update-component.d.ts.map