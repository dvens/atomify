export type ObserverInstanceCallback = (
    inView: boolean,
    intersection: IntersectionObserverEntry,
) => void;

export type ObserverInstance = {
    inView: boolean;
    readonly callback: ObserverInstanceCallback;
    readonly element: Element;
    readonly observer: IntersectionObserver;
    readonly thresholds: ReadonlyArray<number>;
    readonly instanceId: string;
};

export type InstanceMap = Map<Element, ObserverInstance>;
export type ElementMap = Map<Element, string>;
export type ObserverMap = Map<string, IntersectionObserver>;

export interface HasObserverItems {
    rootIsObserved: boolean;
    rootHasItemsLeft: boolean;
}
