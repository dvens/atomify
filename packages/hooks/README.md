# @atomify/hooks
Small hooks library inspired by React hooks but for standard web components.

## Installation

```sh
npm i @atomify/hooks
```

## Configuration
Atomify hooks is made for the modern browsers. Its recommended in legacy browsers to add the following while compiling to ES5 with Babel:
```exclude: /node_modules\/(?!@atomify)/```

Its recommended to use [Web Components polyfill](https://www.npmjs.com/package/@webcomponents/webcomponentsjs) to support everything from Web Components spec in legacy browsers.

## Instructions
All the examples below are made in combination with @atomify/jsx. But its also possible to add your own custom renderer or use plain template literal strings.

## Creating components

`@atomify/hooks` components are made out of functions and Typescript.
You can create new components by importing the defineElement from `@atomify/hooks`. @atomify/core components come without Shadow DOM enabled. You can enable the Shadow DOM by setting the `useShadowDom` argument as true.

```tsx
import { h, Fragment } from '@atomify/jsx';
import { defineElement } from '@atomify/hooks';

const CustomElement = () => {
    return (<Fragment>Hello World!</Fragment>);
};

defineElement('custom-element', CustomElement, {useShadowDom: true});
```

You can now use the component as following inside your HTML:
```html
<custom-element></custom-element>
```

### Using update and the current element
Since the functional component do not have access to the this, its possible to get access to the component `update` function and the `current element`. The `update` function triggers a re-render of the component. We import `FC` from `@atomify/hooks` to get access to those parameters:

```tsx
import { h } from '@atomify/jsx';
import { defineElement, FC } from '@atomify/hooks';

const CustomElement: FC = ({ element, update }) => {
    console.log('Element:', element);
    return (<button onClick={() => update()}>Hello World!</button>);
};

defineElement('custom-element', CustomElement, {useShadowDom: true});
```

## Hooks
@atomify/hooks supports a similar API as React Hooks but mainly focussed on web components.

### Lifecycle hooks
`@atomify/hooks` comes with three different lifecycle hooks:

```tsx
import { h, Fragment } from '@atomify/jsx';
import { defineElement, onUpdated, onDidLoad, onDidUnload } from '@atomify/hooks';

const CustomElement = () => {

    onDidLoad(() => {
        console.log('called when component did load');
    });

    onDidUnload(() => {
        console.log('called when the component is removed')
    });

    onUpdated(() => {
        console.log('called when the component is updated');
    });

    return (<Fragment>Hello World!</Fragment>);
};

defineElement('custom-element', CustomElement, {useShadowDom: true});
```

### useProp
Properties are custom attributes or properties that can be used to pass data through components. Properties have the options to be reflected to attributes. You can expose properties by importing `useProp`. The properties can be `Number`, `String`, `Boolean`, `Object` and `Array`.

Besides importing the hook its also needed to define the prop and the the type of the prop. This is needed because `Atomify` uses this to also create the `observedAttributes` array. Besides that its also used to convert an attribute to a property through this type.

```tsx
import { h, Fragment } from '@atomify/jsx';
import { defineElement, useProp, FC } from '@atomify/hooks';

const CustomElement: FC = () => {
    const [name, setName] = useProp<string>('name', 'default name');
    return (<Fragment>Hello {name}!</Fragment>);
};

CustomElement.props = {
    name: {
        type: String;
    }
};

defineElement('custom-element', CustomElement, {useShadowDom: true});
```

#### Watching the prop
You can track the state of the property by using the 3th index of the array:

```tsx
const [name, setName, watchName] = useProp<string>('name', 'default name');

setName('other default name');

watchName((newValue, oldValue) => {
    console.log(newValue); // other default name
    console.log(oldValue) // default name
});
```

#### Reflecting property to attribute
You can set the `reflectToAttr` option in the `Prop` definitions objects to `true` to reflect the property to an attribute. The property will now be in sync with the attribute:

```tsx
CustomElement.props = {
    name: {
        type: String;
        reflectToAttr: true,
    },
};
```

```html
<custom-element name="default name"></custom-elementt>
```

### useEvent
To dispatch Custom Dom events from components, use the `useEvent` hook. The example below will dispatch `test` event:

```typescript
const event = useEvent<Number>({eventName: 'test'});
event.emit(1);
```

The `useEvent` hook has serveral options that can be used:

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

### useElement & useElements
`useElement` and `useElements` are hooks that are executing `querySelector` and `querySelectorAll` on the shadowRoot if `useShadowDom:true` and otherwise on the this. The hooks return a current object as reference this is needed because this object is getting updated once the component updates and its fully loaded.

```typescript
const div = useElement<HTMLDivElement>('div');
const buttons = useElements<HTMLButtonElement[]>('button');

console.log(div.current); // outputs single div
console.log(buttons.current) // outputs array of buttons
```

**Binded to the this of the element**

Both of the hooks bind the queried element to the this of the custom element. Since we are using functional components you need to specifically tell `Typescript` that these queried elements can be used:

```tsx
import { h, Fragment } from '@atomify/jsx';

import { Component, FC, useElement, defineElement } from '@atomify/hooks';

// Component returns the basic Atomify Component.
export interface CustomElement extends Component {
    div: HTMLDivElement;
}

const CustomElement: FC<CustomElement> = ({ element, update }) => {
    const button = useElement<HTMLButtonElement>('button');
    const event = useEvent<Number>({eventName: 'test'});

    // Listens to the custom event named test.
    useListen('test', (e: CustomEvent) => {
        console.log('useListen:', e.detail);
    }, { target: window });

    // Listens to the click event of the button
    // and fires the custom event when the button is clicked.
    useListen('click', () => {
        event.emit(1);
    },{ target: button});

    return (
        <button>Hello World!</button>
    );
};

defineElement('custom-element', CustomElement, {useShadowDom: true});

// App.ts
const customElement = document.querySelector<CustomElement>('custom-element');

console.log(customElement.div); // returns the single div;
```

### useListen
The `useListen` hook is used to listen to DOM events, it can also listen to the custom events that are being dispatched by the `useEvent` hook:

```typescript
....
const CustomElement: FC<CustomElement> = ({ element, update }) => {
    const div = useElement<HTMLDivElement>('div');

    return (
        <div>Hello World!</div>
    );
};

defineElement('custom-element', CustomElement, {useShadowDom: true})
```

### useStyles
The `useStyles` hook appends the styles in three different ways:
1. It appends the styles to the `adoptedStyleSheets` if available and supported by your browser [Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets).
2. It appends it to the `shadowRoot` when `adoptedStyleSheets` and the `useShadowDom:true` is set.
3. It will append the styles to the document.head when  `useShadowDom:false`, and it will automatically scopes the styles.

**Add styles to your component**

Define styles in a tagged template literal, using the `css` tag function.

```tsx
....
import { css, useStyles } from '@atomify/hooks';

const CustomElement = ({ element, update }) => {

    // Single tagged template literal
    useStyles(() =>
        css`
            :host {
                display: block;
                background-color: tomato;
            }
        `
    );

    // An array of tagged template literals
    useStyles(() => [
        css`...`,
        css`...`,
    ]);

    return (
        <div>Hello World!</div>
    );
};
```

**Sharing styles**

You can share styles between components by creating a `const` is exporting a tagged style:

```tsx
....
const generalButtonStyling = css`
    button {
        color: white;
        background-color: black;
        font-size: 1.6rem;
    }
`;

const CustomElement = ({ element, update }) => {
    // An array of tagged template literals
    useStyles(() => [
        generalButtonStyling,
        css`
            :host {
                display: block;
                background-color: tomato;
            }
        `
    ]);

    return (
        <div>Hello World!</div>
    );
};
```

**Using non `css` literal**

If you must use an variable in a `css` literal that is not itself a `css` literal, and you are sure that it is a safe source then you can wrap the source within a `unsafeCSS` hook:

```typescript
const color = 'green';

css`
    :host {
        display: block;
        background-color: `${unsafeCSS(color)}`;
    }
`
```

### useBindMethod
Because we are using functional components its not possible to make methods available through the outside world. Thats where the `useBindMethod` comes in:

```tsx
export interface CustomElement extends Component {
    log: () => void;
}

const CustomElement: FC<CustomElement> = ({ element, update }) => {

    useBindMethod('log', () => {
        console.log('Hello world!')
    });

    onDidLoad(() => {
        element.log();
    });

    return (
        <button>Hello World!</button>
    );
};

defineElement('custom-element', CustomElement, {useShadowDom: true});

// App.ts
const customElement = document.querySelector<CustomElement>('custom-element');

console.log(customElement.log()); // logs: Hello World!
```

### Composition hooks
The composition hooks are a set of addtive, function-based APIs that allow basic composition of the components.

#### useReactive
Takes an object and returns a reactive object.

```ts
const state = useReactive<{ count: number}>({count: 1});
state.count++;
console.log(state.count) // outputs 2
```

#### useRef
Takes a single value and creates a reactive object from a primitive or object.

```ts
const text = useRef('Some text');
console.log(text.current) // outputs Some text
```

#### useComputed
Create a reactive objects that is synchronized with other reactive properties.

```ts
const state = useReactive<{ count: number}>({count: 1});
const double = useComputed(() => state.count * 2);

console.log(double); // outputs 2
```

#### useWatch
Runs a function immedialty while reactively tracking the dependencies and re-runs whenever a value of a dependency is changed.

```ts
const state = useReactive<{ count: number}>({count: 1});
const double = useComputed(() => state.count * 2);

useWatch(() => {
    console.log(state.count, double.current); // outputs 1, 2
});
```

### Writing your own hooks
Most functionalities can be achieved with the provided hooks above or with `@atomify/kit`. But you can also create your own hooks for custom functionality:

```typescript
import { createHook } from '@atomify/hooks';

export const useHook = (name: string) =>
    createHook<string>({

        // Each callback gives the current element.
        // The hooks of that current element .
        // The index of that current element.
        onDidLoad: (element, hooks, index) => {
            // Fired when the component loaded.
            return `Hello ${name}`;
        },
        onUpdate: () => {
            // Fired when component is updated.
            return `Welcome ${name}`
        },
        onDidUnload: () => {
            // Fird when component is removed from the dom.
        }
    });

const name = useHook('Atomify');
console.log(name) // logs Hello Atomify.
```