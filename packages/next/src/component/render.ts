type RenderFunction = (result: unknown, container: DocumentFragment | Element) => void;

export const render: RenderFunction = (result, container) => {
    // Check type of result
    console.log(result, container);
};
