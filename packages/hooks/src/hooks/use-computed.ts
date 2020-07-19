import { useRef } from './use-ref';
import { useWatch } from './use-watch';

export const useComputed = <T>(transform: () => T | null): { current: T | null } => {
    const reference = useRef<T | null>(null);

    useWatch(() => {
        reference.current = transform();
    });

    return reference;
};
