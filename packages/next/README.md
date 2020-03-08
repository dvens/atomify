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
import { Component, Prop } from '@atomify/next';


export const CustomElement = ({ element, title }) => {
    const [title = title, updateTitle] = useProperty('title');
    const titles = useQuery(element, 'h2');

    return (
        <Fragment>
            <h1 class={'test'}>{ title }</h1>
            <h2>Example title2</h2>
        </Fragment>
    );
};

defineElement('custom-element', CustomElement);

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