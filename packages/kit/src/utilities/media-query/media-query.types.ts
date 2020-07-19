import { breakpoints } from './breakpoints';

export type Breakpoints = keyof typeof breakpoints;
export type BreakpointFunction = (breakpoint: Breakpoints) => string;

export type UseMediaFunction = (
    breakpoints: {
        [key in Breakpoints]: Breakpoint;
    },
) => void;

export type MediaQuery = {
    breakpoint: Breakpoints;
    query: () => string;
};
export interface Breakpoint {
    size: number;
    active: boolean;
}
