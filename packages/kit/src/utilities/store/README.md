# Store utility
Tiny utility to help you manage state across your components.

## Getting started

### 1. Import store utility
```javascript
import createStore from '@utilities/store';
```

### 2. Create a `store` instance
```javascript
import createStore from '@utilities/store';

interface State {
    counter: {
        amount: number;
    };
}

const initialState = {
    counter: {
        amount: 0,
    },
};

const actions = {
    updateCounter: (state: State, payload: { amount: number }) => {
        state.counter = {
            ...state.counter,
            amount: payload.amount
        };

        return state;
    },
};

const store = createStore<State>({
    initialState,
    actions,
});

export default store;
```

### 3. Dispatch values
```javascript
import store from '../path-to-your-store';

store.dispatch('updateCounter', { amount: 1 });
```

### 4. Watch store changes
```javascript
import store from '../path-to-your-store';

store.subscribe(({ counter }) => {
    console.log(counter.amount);
});
```

### 5. Watching store changes based upon keys
This only triggers the fallback based upon the keys given in the array.
```javacript
import store from '../path-to-your-store';

store.subscribe(({ counter }) => {
    console.log(counter.amount);
}, ['counter']);
```