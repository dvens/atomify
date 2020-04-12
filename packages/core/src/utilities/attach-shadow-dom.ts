
export const attachShadowDom = ( target: any ): void => {

    if( !target.shadowRoot && target.__canAttachShadowDom ) {

        target.attachShadow({ mode: 'open' });

    }

};