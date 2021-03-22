# @atomify/kit
Utility kit to use with Atomify hooks components.

## Installation

```sh
npm i @atomify/kit
```
## Configuration
Atomify hooks is made for the modern browsers. Its recommended in legacy browsers to add the following while compiling to ES5 with Babel:
```exclude: /node_modules\/(?!@atomify)/```

Its recommended to use [Web Components polyfill](https://www.npmjs.com/package/@webcomponents/webcomponentsjs) to support everything from Web Components spec in legacy browsers.

## Utilities
Set of utilities that are shipped with the `@atomify/kit`:


| Name | Readme |
| ------- | ------- |
| **Store** | [README](./src/utilities/store/README.md)
| **Inview** | [README](./src/utilities/inview/README.md)
| **Loadable** | [README](./src/utilities/loadable/README.md)
| **Media Query** | [README](./src/utilities/media-query/README.md)


## Hooks
Set of hooks that are shipped with the `@atomify/kit`:

### useClassname

```tsx
const classes = useClassname({ hidden: true, "has-item": !![].length });

// Toggle classes on the div
classes.toggle('hidden');

// Add classes to the div
classes.add('another-class');

// Check if a class exists
classes.contains('has-items');

<div class={classes}>hello{ test.current }</div>
```


### useStore
useStore is a small wrapper around the [Store utility](./src/utilities/store/README.md)

```tsx
const [state, subscribe, prevState] = useStore<StateType>(store);

// Returns the initialState
console.log(state);

subscribe(() => {
    // Logs the previousstate
    console.log(prevstate);
});
```