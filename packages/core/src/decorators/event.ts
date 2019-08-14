import { CustomEventOptions } from '../declarations';

export interface EventEmitter {
    emit( value: any ): void;
}

/**
    * Creates custom events that can be emitted inside the components.
*/
export const Event = ( options: CustomEventOptions = {} ) => {

    return ( target: HTMLElement, propertyName: string ) => {

        const descriptor = {

            get() {

                const _this: any = this;

                return {
                    emit ( value?: any ) {

                        const eventName = options && options.eventName ? options.eventName : propertyName;
                        const eventOptions = Object.assign({}, { detail: value, bubbles: true, cancelable: true }, options );
                        const event = new CustomEvent( eventName, eventOptions );

                        _this.dispatchEvent( event );

                    }
                };

            }

        };

        return Object.defineProperty( target, propertyName, descriptor );

    };

};
