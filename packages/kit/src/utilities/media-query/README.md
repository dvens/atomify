# Media Query
Utility that tracks the state of a CSS media query.

## How to use it

### Setting up the config
Add different kind of breakpoints to the breakpoints config:
```javascript
export const breakpoints = {
    mobile: {
        size: 320,
        active: false,
    },
    mobilePlus: {
        size: 480,
        active: false,
    },
    tabletPortrait: {
        size: 768,
        active: false,
    },
    tabletLandscape: {
        size: 1024,
        active: false,
    },
    laptop: {
        size: 1260,
        active: false,
    },
    desktop: {
        size: 1600,
        active: false,
    },
};
```

### useMedia
The useMedia function accepts a callback with breakpoints. The callback is triggerd when the function is initialized and when a breakpoint changed.
```javascript
import { useMedia } from '@source/utilities/media-query';

useMedia(({ mobile, mobilePlus }) => {
    console.log(mobile, mobilePlus);
});
```

### Get current breakpoint
Returns the current active breakpoint.
```javascript
import { getCurrentBreakpoint } from '@source/utilities/media-query';

console.log(getCurrentBreakpoint());
```

### Media watcher
Method that calls a callback everytime a media-query matches.

```javascript
import { mediaWatcher, min, max } from '@source/utilities/media-query';

mediaWatcher('(min-width: 600px)', (matches) => {
    console.log(matches);
});

mediaWatcher(`${min('tabletPortrait')} and ${max('tabletLandscape')}`, (matches) => {
    console.log(matches);
});
```