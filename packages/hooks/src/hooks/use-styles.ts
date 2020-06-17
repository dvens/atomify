import { adoptStyles, CSSResultOrNative } from '../css';
import { createHook } from './hook';

export const useStyles = (styleCallback: () => CSSResultOrNative | Array<CSSResultOrNative>) => {
    const styleCallbackResult = styleCallback();
    const styles = Array.isArray(styleCallbackResult)
        ? [...styleCallbackResult]
        : [styleCallbackResult];

    return createHook({
        onDidLoad: (element) => adoptStyles(element, styles),
    });
};
