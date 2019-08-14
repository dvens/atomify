export interface KeyValue {
    [key: string]: any;
}
export declare type TypeHint = 'Boolean' | 'String' | 'Object' | 'Number' | 'Array' | Boolean;
export interface PropertyOptions {
    reflectToAttribute?: boolean;
    type?: TypeHint;
    reRender?: boolean;
}
export interface Property {
    [key: string]: PropertyOptions;
}
export interface PropertyTarget {
    connected: boolean;
    _watchedProperties: Map<unknown, unknown>;
}
export interface PropertyConverter {
    toAttribute: (name: string, value: unknown, type?: TypeHint) => ConvertedOptions;
    toProperty: (name: string, value: unknown, type?: TypeHint) => ConvertedOptions;
}
export interface ConvertedOptions {
    value: any;
    name: string;
}
//# sourceMappingURL=property.d.ts.map