# @atomify/core

@atomify/core helps you to easily create custom elements using Typescript and decorators.

## Creating components

@atomify/core components are made with decorators, plain ES6 classes and Typescript.
You can create new components importing the @Component decorator from '@atomify/core'. The `tag` argument expects the name of the custom element. The `style` argument (optional) expects the styling for custom element. @atomify/core components come without Shadow DOM enabled. You can enable the Shadow DOM by setting the `shadow` argument as true.

```typescript
import { Component } from '@atomify/core';

@Component({
    tag: 'counter-element',
    style: `
        :host {
            background-color: var(--example-bsackground-color, tomato);
        }
    `,
    shadow: true
})
export class CounterElement extends HTMLElement {

    render() {
        return `
            <h1>Hello world!</h1>
        `;
    }

}
```

You can now use the component as following inside your HTML:
```html
<counter-element></counter-element>
```

## Component lifecycle callbacks
The components have special lifecycle hooks that can be implemented:

| Lifecycle      | Description |
| ----------- | ----------- |
| constructor      | This is being called when a new instance is created ( useful for setting state or settings )       |
| connectedCallback   | This is being called everytime the element is inserted into the DOM        |
| disconnectedCallback      | This is being called everytime the element is removed from the DOM       |
| adoptedCallback      | This is being called when the custom element is moved into a new DOM       |

## Property Decorator
Properties are custom attributes or properties that can be used to pass data through components. Properties have the options to be reflected to attributes. You can expose properties to import the `@Prop` from the '@atomify/core'. The properties can be `Number`, `String`, `Boolean`, `Object` and `Array`. You can get access to the property via `this` operater ( see the this.name ) as example.

```typescript
import { Component, Prop } from '@atomify/core';

...
export class CounterElement extends HTMLElement {

    @Prop() name: string = 'Joe';

    render() {

        return `
            <h1>Hello my name is: ${ this.name }</h1>
        `;

    }

}
```

## Property reflecting to attribute
You can set the `reflectToAttribute` argument in the `@Prop` decorator to `true` to reflect the property to an attribute. The property will now be in sync with the attribute:

```typescript
@Prop({ reflectToAttribute: true }) name: string = 'Joe';
```

## Property type hinting
Typehint is used to indicate the type of a property. This is used to conver the attribute to/from property.
This is done since Javascript does not know type a HMTL attribute is. The types can be: `Number`, `String`, `Boolean`, `Object` and `Array`

```typescript
@Prop({ type: Boolean }) name: string = 'Joe';
```

The property will now be reflecting to the custom element when inserted into the DOM.
```html
<counter-element name="Joe"></counter-element>
```

## Watch decorator
To do validation or to watch changes on a property, you can use the `@Watch` decorator.
```typescript
import { Component, Prop, Watch } from '@atomify/core';

...
export class CounterElement extends HTMLElement {

    @Prop({ reflectToAttribute: true }) name: string = 'Joe';

    @Watch('name')
    nameChanged( newValue: string, oldValue: string ) {

        console.log( newValue, oldValue );

    }

}
```

## Events decorator
To dispatch Custom Dom events from components, use the `@Event` decorator. The example below will dispatch `counterElementChanged` event:
```typescript
import { Component, Event, EventEmitter } from '@atomify/core';

...
export class CounterElement extends HTMLElement {

    @Event() counterElementChanged: EventEmitter;

    counterElementChangedHandler() {

        this.counterElementChanged.emit('todo value');

    }

}
```

The `@Event` decorator has serveral options that can be used:

```typescript
interface CustomEventOptions {

    // Boolean that tells if the event can bubble up
    bubbles?: boolean;

    // Boolean that tells the event whether it can bubble up through the boundary between shadow DOM and DOM.
    composed?: boolean;

    // Boolean that tells if the event can be canceled
    cancelable?: boolean;

    // The default event name can be overwritten by using the eventName argument.
    eventName?: string;

}
```

## Query & QueryAll decorators
`@Query` and `@QueryAll` are decorators that are executing `querySelector` and `querySelectorAll` on the shadowRoot if `shadow:true` and otherwise on the this. The properties are accesible through the `this`:

```typescript
import { Component, Query, QueryAll } from '@atomify/core';

...
export class CounterElement extends HTMLElement {

    @Query('counter-list') counterList: HTMLElement;
    @QueryAll('button') buttons: HTMLElement[];

    bindEvents() {

        Array.from( this.buttons )
            .forEach( button =>
                button.addEventListener('click', ( e: Event ) => console.log( e )
            ) );

    }

    render() {

        return `
            <button>Previous</button>
            <button>Next</button>

            <ul class="counter-list">
                <li>Apple</li>
                <li>Banana</li>
            </ul>
        `;

    }
}
```

## Listen decorator
The `@Listen` decorator is used to listen to DOM events, it can also listen to the custom events that are being dispatched by the `@Events` decorator

```typescript
import { Component, Listen } from '@atomify/core';

....
export class CounterElement extends HTMLElement {

    @Listen('counterElementChanged')
    counterElementChangedHandler( e: CustomEvent ) {

        console.log('Received event: ', e.detail );

    }

}
```

The `@Listen` decorator is using `this` as default listen target. This can be overwritten by the `target` parameter equal to `document` or `window`;

```typescript
@Listen('counterElementChanged', { target: document } )
```

@Listen options:
```typescript
export interface ListenOptions {
    target?: EventType;
    capture?: boolean;
    passive?: boolean;
}
```

The `@Listen` decorator can also be combined with `@QueryAll` and the `@Query` decorators.

```typescript
import { Component, Query, QueryAll, Listen } from '@atomify/core';

...
export class CounterElement extends HTMLElement {

    @Query('counter-list') counterList: HTMLElement;
    @QueryAll('button') buttons: HTMLElement[];

    @Listen('click', { target: 'buttons' } )
    buttonClicked( e: Event ) {

        console.log( e.currentTarget );

    }

    render() {

        return `
            <button>Previous</button>
            <button>Next</button>

            <ul class="counter-list">
                <li>Apple</li>
                <li>Banana</li>
            </ul>
        `;

    }
}
```

## TODO for 1.2.0
- [ ] Property rerender option
- [ ] Transform delegate util into decorator