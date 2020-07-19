import { IDefferObject } from '../declarations';

export function defer<T>(): IDefferObject<T> {
    let resolve: (value?: T) => void = null as any;
    const promise = new Promise<T>((res) => (resolve = res));
    return {
        promise,
        resolve,
    };
}
