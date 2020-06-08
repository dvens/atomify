export const supportsPassive = () => {
    let supportsPassive = false;

    try {
        const options = Object.defineProperty({}, 'passive', {
            get: () => {
                supportsPassive = true;
                return supportsPassive;
            },
        });

        window.addEventListener(
            'passiveTest',
            () => {
                return;
            },
            options,
        );
        window.removeEventListener(
            'passiveTest',
            () => {
                return;
            },
            options,
        );
    } catch (e) {
        supportsPassive = false;
    }

    return supportsPassive;
};
