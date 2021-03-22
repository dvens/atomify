# @atomify/css

## Installation

```sh
npm i @atomify/css
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
import { css, useStyles } from '@atomify/css';

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