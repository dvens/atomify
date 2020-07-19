const processNodes = (child: Node | NodeList, fragment: DocumentFragment) => {
    if (child instanceof Node) {
        fragment.appendChild(child);
    } else if (typeof child === 'string' || typeof child === 'number') {
        fragment.appendChild(document.createTextNode(child));
    } else if (child instanceof Array) {
        child.forEach((child) => processNodes(child, fragment));
    }

    return fragment;
};

export const createFragementFromChildren = (children: NodeList) => {
    const fragment = document.createDocumentFragment();

    children.forEach((child) => processNodes(child, fragment));

    return fragment;
};
