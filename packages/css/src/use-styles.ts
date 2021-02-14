import { createHook } from '@atomify/hooks';

import { adoptStyles, CSSResultOrNative } from './css';

export const useStyles = (styleCallback: () => CSSResultOrNative | Array<CSSResultOrNative>) => {
    const styleCallbackResult = styleCallback();

    const styles = Array.isArray(styleCallbackResult)
        ? [...styleCallbackResult]
        : [styleCallbackResult];

    return createHook({
        onDidLoad: (element) => adoptStyles(element, styles),
    });
};
