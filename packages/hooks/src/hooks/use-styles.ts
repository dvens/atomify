import { addStyle, StyleObject } from '../css';
import { createHook } from './hook';

export const useStyles = (styleCallback: () => StyleObject) => {
    const { cssText, token } = styleCallback();

    return createHook({
        onDidLoad: (element) => addStyle(element, token, cssText),
    });
};
