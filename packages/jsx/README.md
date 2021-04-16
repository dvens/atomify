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

@atomify/jsx works together with `@atomify/hooks`

## Render function
To get started using @atomify/jsx, first look at the render() function. This function accepts a tree description and creates the structure described. Next, it appends this structure to a parent DOM element provided as the second argument:

```tsx
import { h, render } from '@atomify/jsx';
function Title(text: string) {
    return <h1>{text}</h1>
}
render(<Title text="Hello world!" />, document.body);
```

## Serverside rendering
`@atomify/jsx` is shipped with a `renderToString` that will functional components into HTML string for SSR usage.

```tsx
import { renderToString } from '@atomify/jsx'
function Title(text: string) {
    return <h1>{text}</h1>
}

const result = renderToString(<Title text="Hello world" />);

console.log(result) // <h1>Hello world</h1>
```

*@atomify/hooks*

```tsx
import { h , Fragment } from '@atomify/jsx';
import { defineElement, useProp} from '@atomify/hooks';

const CustomElement: FCE = () => {
    const [title] = useProp<Number>('title', 'Hello world!');

    return (
        <Fragment>
            <h1>{ title }</h1>
            <h2>Example title2</h2>
        </Fragment>
    );
};

CustomElement.props = {
    someTitle: {
        type: Number,
        reflectToAttr: true,
    }
};

defineElement('custom-element', CustomElement);
```

## Class and Classname
Both `class` and `className` are supported. The `class` attribute doesnt support `object` or `array` anymore since version 2.0 it will be using a plugin that can be installed through `@atomify/shared` (it accepts a string, array, object or everything combined):

```tsx
import { classNames } from '@atomify/shared';

<div
    className={classNames('aaa',
        { test1: true, test2: false }, [
        '1',
        false,
    ])}>
</div>
```

## Ref
The `ref` attribute accepts a `function` or a direct `ref` object. The `ref` object must include the `current` property.
