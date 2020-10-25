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

@atomify/jsx works together with `@atomify/core` and `@atomify/hooks`

*@atomify/hooks*

```tsx
import { h , Fragment } from '@atomify/jsx';
import { defineElement, useProp} from '@atomify/hooks';

const CustomElement: FC = () => {
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

*@atomify/core*

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

## Class and Classname
Both `class` and `className` are supported. The `class` attribute can take a `string`, `object` or `array`:

```tsx
const hasChildren = true;
const title = 'Hello world!'

<h1 class={'test'}>{ this.title }</h1>
<h1 class={[ hasChildren ? 'its true': 'not true']}>{ title }</h1>
<h1 class={{['is-hidden']: hasChildren }}>{ title }</h1>
```

## Ref
The `ref` attribute accepts a `function` or a direct `ref` object. The `ref` object must include the `current` property.

```tsx
import { getSheets, setup, styled } from '@atomify/css';
import { setDefaultRender } from '@atomify/hooks';
import { h, render, renderToString, Head } from '@atomify/jsx';
import { prefixer } from 'prefix-library';

// Set global default render atomify // default is string renderer.
setDefaultRender(render);

// Tell atomify css what JSX to use.
// Client side it will be apended to the head
setup({
    render: h,
    prefixer,
});

// This will generate the .button__default class
// Will be apended to the head.
const Button = styled.button<{ size: number }>('button__default')`
    width: ${props => props.size || '20px'};
`;

<Button size={20}>hello</Button>

// This will generate a random hash
// Will be anpended to the head.
const Button = styled.button<{ size: number }>`
    width: ${props => props.size || '20px'};
`;

<Button size={20}>hello</Button>

const Home = () => {
    <Head>
        <title>hello</title>
    </Head>
    <Button size={20}>hello</Button>;
};

export const getStaticSSRProps: async = ({ id }) => {
    const posts = await getPosts({ id });
    return {
        posts
    };
};


// Client side
render(Home, document.qetElementBydId('app'));

// SSR
// Extracting css on the server,
const stylesheet = getSheets();
const body = renderToString(Home);
const style =  getStyleTags() or getStyleTag()
const head = Head.renderToString(Home);
```