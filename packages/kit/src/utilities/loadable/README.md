# Loadable
A utility for dynamically loading a module before rendering it by using dynamic imports and the Intersecion Observer API.

## How to use it

### Using hook
The hook is using document.querySelectorAll underwater. The hook can be used as element, class or data attribute.

```javascript
import { Loadable } from '@utilities/loadable';

Loadable({
    hook: 'counter-element',
    loader: () => import('@source/components/atoms/counter-element'),
    onLoaded: () => console.log('Counter Element loaded!'),
    onError: () => console.log('Some error occurred by loading the module!'),
});
```

### Intersection Observer
The Loadable utility is using the Intersection Observer to load the dynamic import when the element given to the hook is in view. The options of the Intersection Observer can be extended as following:

```javascript
import { Loadable } from '@utilities/loadable';

Loadable({
    hook: 'counter-element',
    loader: () => import('@source/components/atoms/counter-element'),
    inViewOptions: {
        threshold: 1,
    },
});
```
(Other options for the Intersection Observer can be found here https://developer.mozilla.org/en-US/docs/Web/)

### Custom empty/loading state
You can add your own loading state with the `loading` option. It accepts a string that will be appended to the hook element. The loading state will be removed when the dynamic import is loaded. If you are using [@atomify/core](https://www.npmjs.com/package/@atomify/core) it will remove the loading state when `componentOnReady` is being called.

```javascript
import { Loadable } from '@utilities/loadable';

Loadable({
    hook: 'counter-element',
    loading: '...loading',
    loader: () => import('@source/components/atoms/counter-element')
});
```