export const classNames = (value: object | Array<any> | string | null): string => {
    if (value == null) {
        return '';
    } else if (typeof value === 'string') {
        return value;
    } else if (Array.isArray(value)) {
        return value.filter(Boolean).join(' ');
    } else {
        return Object.keys(value as Record<string, unknown>)
            .filter((i) => !!(value as any)[i])
            .join(' ');
    }
};
