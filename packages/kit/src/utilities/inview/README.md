# Inview util
Javascript implementation of the Intersection Observer API to tell you when an element enters or leaves the viewport.

## How to use it
```javascript
import { inviewObserver } from '@utilities/inview';

// query the element you want to observe
const element = document.querySelector('[js-hook-observed-element]');

// Options for the intersection observer can be found here https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
const options = {
    treshHold: 1,
};

// Observe takes in a element, callback and options (for the intersection observer)
// The callback gives back an inview boolean and the intersection
inviewObserver.observe( element, ( inView, intersection ) => {
    console.log( inView, intersection );
}, options );

// Unobserve an element
inviewObserver.unobserve( element );

// Destroy all the observers at once.
inviewObserver.destroy();
```