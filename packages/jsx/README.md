# @atomify/jsx
Small library for creating Custom Elements from JSX Markup.

## Installation
```sh
npm i @atomify/jsx
```

## Configuration
@atomify/jsx requires `@babel/plugin-syntax-jsx` and `@babel/plugin-transform-react-jsx`.

```sh
npm install --save-dev @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx
yarn add --dev @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx
```

After you installed the plugins you no need to configure your Babel Settings

```json
{
  "plugins": [
    "@babel/plugin-syntax-jsx",
    ["@babel/plugin-transform-react-jsx", { "pragma": "h" }]
  ]
}
```

and add the following to your tsconfig.json:

```json
"compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
}
```

@atomify/jsx works together with @atomify/core and you could use it as following:

```tsx
import { h , Fragment } from '@atomify/jsx';
import { Component, Prop } from '@atomify/core';

@Component({
    tag: 'custom-element'
})
export class CustomElement extends HTMLElement {

    @Prop({ reRender: true, reflectToAttribute: true })
    title: string = 'Hello world!';

    render() {

        return (
            <Fragment>
                <h1 class={'test'}>{ this.title }</h1>
                <h2>Example title2</h2>
            </Fragment>
        );

    }
}
```

## Class
Both `class` and `className` are supported. The `class` attribute can take a `string`, `object` or `array`:

```tsx
const hasChildren = true;

<h1 class={'test'}>{ this.title }</h1>
<h1 class={[ hasChildren ? 'its true': 'not true']}>{ this.title }</h1>
<h1 class={{['is-hidden']: hasChildren }}>{ this.title }</h1>
```

## Ref
The `ref` attribute accepts a `function` or a direct `ref` object. The `ref` object must include the `current` property.