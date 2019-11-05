export function defer() {
    let resolve = null;
    const promise = new Promise(res => resolve = res);
    return {
        promise,
        resolve,
    };
}
//# sourceMappingURL=defer.js.map