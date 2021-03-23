export type ClassValue = string | null | boolean | undefined | ClassObject | ClassArray;

export type ClassArray = ClassValue[];

export interface ClassObject {
    [id: string]: any;
}

export const toValue = (value: ClassValue): string => {
    if (!value) return '';

    const classes = [];

    if (typeof value === 'string' || typeof value === 'number') {
        classes.push(value);
    } else if (Array.isArray(value)) {
        if (value.length) {
            value.forEach((arg) => {
                const item = toValue(arg);
                if (item) classes.push(item);
            });
        }
    } else if (typeof value === 'object') {
        for (const item in value) {
            if (value[item] && item) {
                classes.push(item);
            }
        }
    }

    return classes.join(' ');
};

export const classNames = (...args: ClassArray) => {
    const argLength = args.length;

    if (argLength === 0) return '';
    if (argLength === 1) return toValue(args[0]);

    let tmp;
    const classes = [];

    for (const item in args) {
        tmp = toValue(args[item]);
        if (tmp) classes.push(tmp);
    }

    return classes.join(' ');
};
