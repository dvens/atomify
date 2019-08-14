import { PropertyOptions } from '../declarations';
/**
    * @Prop decorator is declaring props on the component that can be custom properties/attributes.
    * the props can be reflected to the attributes by setting the reflectToAttribute on true.
*/
export declare const Prop: (options?: PropertyOptions | undefined) => (target: any, name: string) => any;
/**
    * Initializes propertys to attributes in the connectedcallback when the property has the reflectToAttribute option.
*/
export declare const initializePropertyToAttributes: (target: any) => void;
/**
    * Transforms attribute to property.
*/
export declare const attributeToProperty: (target: any, attributeName: string, newValue: any) => void;
//# sourceMappingURL=property.d.ts.map