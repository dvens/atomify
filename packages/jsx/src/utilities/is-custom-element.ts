export const isCustomElement = (element: HTMLElement) => {
    return element && element.tagName && element.tagName.includes('-');
};
