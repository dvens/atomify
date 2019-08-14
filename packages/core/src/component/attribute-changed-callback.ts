import { ComponentConstructor } from '../declarations';
import { camelCaseToDash } from '../utilities';
import { attributeToProperty } from '../decorators';

export const attributeChangedCallback = ( target: ComponentConstructor, name: string, oldValue: any, newValue: any ) => {

    if ( oldValue !== newValue ) {

        attributeToProperty( target, name, newValue );

    }

};

export const getObservedAttributes = ( target: ComponentConstructor ) => {

    const props = target.properties;
    const attributes: string[] = [];

    if( props ) {

        props.forEach( ( _:any, key: string ) => attributes.push( camelCaseToDash( key ) ) );

    }

    return attributes;

};