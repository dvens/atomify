type HTMLAttributeReferrerPolicy =
    | ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';

export interface LinkProps {
    as?: string;
    crossOrigin?: string;
    href?: string;
    hrefLang?: string;
    integrity?: string;
    media?: string;
    referrerPolicy?: HTMLAttributeReferrerPolicy;
    rel?: string;
    sizes?: string;
    type?: string;
    charSet?: string;
}

export interface MetaProps {
    charSet?: string;
    content?: string;
    httpEquiv?: string;
    name?: string;
}
