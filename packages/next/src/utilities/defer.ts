export interface DefferObject<T> {
    promise: Promise<T>;
    resolve: (value?: T) => void;
}

export function defer<T>(): DefferObject<T> {
    let resolve: (value?: T) => void = null as any;
    const promise = new Promise<T>((res) => (resolve = res));
    return {
        promise,
        resolve,
    };
}
