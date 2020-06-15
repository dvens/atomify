import { addStyle, registerStyle, StyleObject } from '../css';
import { createHook } from './hook';

export const useStyles = (styleCallback: () => StyleObject) =>
    createHook({
        onDidLoad: (element) => {
            const { cssText, token } = styleCallback();
            registerStyle(element, cssText);
            addStyle(element, token);
        },
        onUpdate(element) {
            const { token } = styleCallback();
            addStyle(element, token);
        },
    });
