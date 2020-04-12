import { ComponentConstructor } from '../declarations';
import { attributeToProperty } from '../decorators';
import { camelCaseToDash } from '../utilities';

export const attributeChangedCallback = ( target: ComponentConstructor, name: string, oldValue: any, newValue: any ) => {

    if ( oldValue !== newValue ) {

        attributeToProperty( target, name, newValue );

    }

};

export const getObservedAttributes = ( target: ComponentConstructor ) => {

    const props = target.properties;
    const attributes: string[] = [];

    if( props ) {

        props.forEach( ( _: any, key: string ) => attributes.push( camelCaseToDash( key ) ) );

    }

    return attributes;

};