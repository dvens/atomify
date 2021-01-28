/**
 * @template F
 * @param {F} func
 * @param {number} waitFor
 * @returns
 */
export const debounce = <F extends (...args: any) => any>(func: F, waitFor: number) => {
    let timeout: NodeJS.Timeout;

    const debounced = (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
};
