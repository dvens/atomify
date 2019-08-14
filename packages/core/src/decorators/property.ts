import { KeyValue, PropertyOptions, PropertyTarget } from '../declarations';
import { propertyConverter, dashToCamelCase } from '../utilities';
import { CLASS_PROPERTIES, PROPERTIES, REFLECTED_PROPERTIES_TO_ATTRIBUTE, IS_REFLECTING_PROPERTY, WATCHED_PROPERTIES, IS_REFLECTING_ATTRIBUTE } from '../constants';

const defaultPropertyDeclaration: PropertyOptions = {
    reflectToAttribute: false,
    type: false,
    reRender: false,
};

/**
    * @Prop decorator is declaring props on the component that can be custom properties/attributes.
    * the props can be reflected to the attributes by setting the reflectToAttribute on true.
*/
export const Prop = ( options?: PropertyOptions ) => {

    return ( target: any, name: string ) => {

        const key = `_${name}`;

        // Ensure that the __classProperties map is there.
        if( !target.constructor[CLASS_PROPERTIES] ) {

            target.constructor[CLASS_PROPERTIES] = new Map();

        }

        if( !target.constructor[PROPERTIES] ) {

            target.constructor[PROPERTIES] = new Map();

        }

        target.constructor[PROPERTIES].set(name);

        // Check if the property has any options and store them.
        if( options ) {

            target.constructor[CLASS_PROPERTIES].set( name, options );

        }

        const descriptor = {

            get() {

                return ( this as KeyValue )[key as string];

            },

            set( this: PropertyTarget, value: unknown ) {

                const oldValue = (this as KeyValue)[name as string];
                (this as KeyValue)[key as string] = value;

                requestUpdate( this, name, oldValue );

            },

            enumerable: true,
            configurable: true,

        };

        return Object.defineProperty( target, name, descriptor );

    }

}

/**
    * Initializes propertys to attributes in the connectedcallback when the property has the reflectToAttribute option.
*/
export const initializePropertyToAttributes = ( target: any ) => {

    const reflectedProperties = target.constructor[REFLECTED_PROPERTIES_TO_ATTRIBUTE];

    if( !reflectedProperties ) return;

    reflectedProperties.forEach( ( propValue: any, propName: any ) => {

        propertyToAttribute( target, propName, propValue );

    });

    target.constructor[REFLECTED_PROPERTIES_TO_ATTRIBUTE] = undefined;

}

/**
    * Requests an update for the component.
    * Reflects the property to attribute when needed.
*/
const requestUpdate = ( target: any, name: string, oldValue: any ) => {

    const newValue = target[name];
    const hasChanged = valueHasChanged( newValue, oldValue );
    const options: PropertyOptions = target.constructor[CLASS_PROPERTIES].has( name ) ? target.constructor[CLASS_PROPERTIES].get( name ) : defaultPropertyDeclaration;

    // Component can only apply watchers and reflect attributes when it is connected.
    if( target.connected ) {

        if( hasChanged && target.constructor[WATCHED_PROPERTIES] ) callWatcher( target, name, newValue, oldValue );
        if( options.reflectToAttribute ) propertyToAttribute( target, name, newValue );
        if( options.reRender ) target.reRender();

    } else {

        // Ensure that the reflected properties to attribute map is there.
        if( !target.constructor[REFLECTED_PROPERTIES_TO_ATTRIBUTE] ) {

            target.constructor[REFLECTED_PROPERTIES_TO_ATTRIBUTE] = new Map();

        }

        // Push the reflected property to attribute in the store to reuse when the component is connected.
        if( options.reflectToAttribute ) {

            target.constructor[REFLECTED_PROPERTIES_TO_ATTRIBUTE].set( name, newValue );

        }

    }

};

/**
    * Transforms property to attribute.
*/
const propertyToAttribute = ( target: any, propertyName: string, newValue: any ) => {

    const { type } = getType( target, propertyName );
    const { name, value } = propertyConverter.toAttribute( propertyName, newValue, type );

    if( value === undefined || target.constructor[IS_REFLECTING_PROPERTY] ) return;

    target.constructor[IS_REFLECTING_ATTRIBUTE] = true;

    if( value == null ) {

        target.removeAttribute( name );

    } else {

        target.setAttribute( name, value );

    }

    target.constructor[IS_REFLECTING_ATTRIBUTE] = false;

};


/**
    * Transforms attribute to property.
*/
export const attributeToProperty = ( target: any, attributeName: string, newValue: any ) => {

    if ( target.constructor[IS_REFLECTING_ATTRIBUTE] ) return;

    const { type } = getType( target, attributeName );
    const { name, value } = propertyConverter.toProperty( attributeName, newValue, type );

    target.constructor[IS_REFLECTING_PROPERTY] = true;

    target[name] = value;

    target.constructor[IS_REFLECTING_PROPERTY] = false;

};


/**
    * Get the type for the property/attribute converter.
*/
const getType = ( target: any, attributeName: string ) => {

    const attrName = dashToCamelCase( attributeName );

    return target.constructor[CLASS_PROPERTIES].has( attrName )
        ? target.constructor[CLASS_PROPERTIES].get( attrName )
        : defaultPropertyDeclaration;

};

/**
    * Checks if there is a watcher set for the property.
    * Fires the watcher and sends the old and new value to the watcher.
*/
const callWatcher = ( target: any, name: string, newValue: any, oldValue: any )  => {

    const hasWatcher = target.constructor[WATCHED_PROPERTIES].has( name );
    const watcherName = hasWatcher ? target.constructor[WATCHED_PROPERTIES].get( name ) : false;
    const watcher = hasWatcher ? target[watcherName].bind( target ) : false;

    if( watcher && typeof watcher === 'function' ) {

        watcher( newValue, oldValue );

    }

}

/**
    * Function that returns true if `value` is different from `oldValue`.
*/
const valueHasChanged = ( value: unknown, old: unknown ): boolean => {

    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && ( old === old || value === value );

};