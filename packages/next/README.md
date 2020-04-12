# @atomify/next

Small library for creating Custom Elements from JSX Markup.

## Installation

```sh
npm i @atomify/next
```

## Configuration

@atomify/next works together with @atomify/jsx and you could use it as following:

```jsx
import { h , Fragment } from '@atomify/jsx';
import { defineElement, useWatch, onComponentDidload, onComponentUnload, useQuery, useEvent,useListen } from '@atomify/next';
import { createStore, useStore } from '@atomify/utilities';

// Create store in seperate file.
const store = createStore<State>({ count: 1 });

// Also in a seperate file.
const { storeChanged, updateStore } = useStore(store);
const updateTitle = () => {
    updateStore((state) => {
        state.count = 2;
        return state;
    });
};

// Component setup
export const CustomElement = () => {
    const [value, updateValue] = useProperty<String>('value', {value});
    const changeEvent = useEvent<Number>('amountChanged');
    const amount = useQuery<HTMLSpanElement>('[js-hook-amount]');

    useWatch({ value }) => {
        amount.innerText = value.newValue;
        changeEvent(value.newValue);
    }, ['value']);

    // Listens to events.
    useListen('click', (e: MouseEvent) => {
        console.log('title has been clicked: ', e);
    },[title]);

    // Triggered when component is added/loaded to the dom.
    onComponentDidload(() => {
        console.log('component loaded!');
    });

    // Triggered when component is removed from the dom
    onComponentUnload(() => {
        console.log('on component unload!');
    });

    return (
        <Host shadow={true} styles={style}>
            <h1 class={'test'}>{ title }</h1>
            amount:<span js-hook-amount></span>
            <button onClick={updateTitle}></button>
        </Host>
    );
};

defineElement('custom-element', CustomElement);
```

```html
<custom-element value="this is just a title"></custom-element>
```

```jsx
<custom-element value="this is just a title" />
```
