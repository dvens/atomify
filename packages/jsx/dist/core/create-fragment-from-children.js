const processNodes = (child, fragment) => {
    if (child instanceof Node) {
        fragment.appendChild(child);
    }
    else if (typeof child === 'string' || typeof child === 'number') {
        fragment.appendChild(document.createTextNode(child));
    }
    else if (child instanceof Array) {
        child.forEach(child => processNodes(child, fragment));
    }
    return fragment;
};
export const createFragementFromChildren = (children) => {
    const fragment = document.createDocumentFragment();
    children.forEach(child => processNodes(child, fragment));
    return fragment;
};
//# sourceMappingURL=create-fragment-from-children.js.map