import { ComponentConstructor, ComponentOptions, StyleString } from '../declarations';

/*
    * Generates (concats) styling based upon the style string and styles array given by the component.
*/
export const generateStyles = ( target: ComponentConstructor, options: ComponentOptions ) => {

    const style = options.style;
    const styles = options.styles;

    if( style && styles ) throw new Error(`Component: ${ target.__nodeName } can only have on type of style property: styles or style`);

    if( style ) return style;
    if( styles ) return styles.join('');

    return false;

};

/*
    * This is being used when the shadowdom option is being disabled.
    * Creates styling element based upon the options set by the component.
*/
export const generateGeneralStyling = ( target: ComponentConstructor, style: StyleString ) => {

    const componentName = `${target.__nodeName}`;

    if ( !document.head.querySelector(`[scope="${componentName}"]`) ) {

        const styleTemplate = document.createElement('style');

        styleTemplate.setAttribute('scope', `${componentName}`);
        styleTemplate.innerText = `${ style }`;
        styleTemplate.innerText = styleTemplate.innerText.replace(/:host/gi, `${componentName}`);

        document.head.appendChild( styleTemplate );

    }

};