import { breakpoints } from '../breakpoints';
import { Breakpoints, MediaQuery } from '../media-query.types';

export function getSizeFromBreakpoint(breakpointValue: Breakpoints) {
    if (breakpoints[breakpointValue].size) {
        return breakpoints[breakpointValue].size;
    } else {
        console.error('No valid breakpoint or size specified for media.');
        return '0';
    }
}

export function getMediaQueries(): MediaQuery[] {
    const breakpointMap = Object.keys(breakpoints);

    return breakpointMap.map((item: Breakpoints, index: number) => {
        const breakpoint = breakpoints[item];
        const breakpointAbove = breakpoints[breakpointMap[index + 1] as Breakpoints];

        return {
            breakpoint: item,
            query: () => {
                if (index === 0) {
                    return `(max-width: ${breakpointAbove.size - 1}px)`;
                } else if (index === breakpointMap.length - 1) {
                    return `(min-width: ${breakpoint.size}px)`;
                } else {
                    return `(max-width: ${breakpointAbove.size - 1}px) and (min-width: ${
                        breakpoint.size
                    }px)`;
                }
            },
        };
    });
}
