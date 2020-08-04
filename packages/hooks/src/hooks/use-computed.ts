import { useRef } from './use-ref';
import { useWatch } from './use-watch';

export const useComputed = <T>(transform: () => T) => {
    const reference = useRef<T>(transform());

    useWatch(() => {
        reference.current = transform();
    });

    return reference;
};
