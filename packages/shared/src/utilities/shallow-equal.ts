export const shallowEqual = (object1: object, object2: object) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (object1[key as keyof typeof object1] !== object2[key as keyof typeof object2]) {
            return false;
        }
    }

    return true;
};
