import { breakpoints } from './breakpoints';
import { BreakpointFunction, Breakpoints, UseMediaFunction } from './media-query.types';
import { getMediaQueries, getSizeFromBreakpoint } from './utils';

const max: BreakpointFunction = breakpoint => `(max-width: ${getSizeFromBreakpoint(breakpoint)}px)`;

const min: BreakpointFunction = breakpoint => `(min-width: ${getSizeFromBreakpoint(breakpoint)}px)`;

/**
 * Method that calls a callback everytime a media-query matches
 * mediaWatcher(`(min-width: 600px)`, (matches) => {
 *    console.log(matches);
 * });
 * @function mediaWatcher
 * @param mediaQuery { string }
 * @param layoutChangedCallback { callback }
 */
const mediaWatcher = (
    mediaQuery: string,
    layoutChangedCallback: (mediaQueryMatches: boolean) => void,
) => {
    const mediaQueryListener = window.matchMedia(mediaQuery);
    mediaQueryListener.addListener(e => layoutChangedCallback(e.matches));
    layoutChangedCallback(mediaQueryListener.matches);
};

/**
 * Returns current active breakpoint
 * @function getCurrentBreakpoint
 */
const getCurrentBreakpoint = () =>
    getMediaQueries().reduce(
        (previous, current) =>
            window.matchMedia(current.query()).matches ? current.breakpoint : previous,
        undefined,
    );

/**
 * Returns the breakpoints object in the given callback
 * @function useMedia
 * @param callback returns @type Breakpoints
 */
const useMedia = (callback: UseMediaFunction) => {
    const breakpointObject = getMediaQueries();

    breakpointObject
        .map(breakpoint => {
            return {
                listener: window.matchMedia(breakpoint.query()),
                breakpoint: breakpoint.breakpoint,
            };
        })
        .forEach(breakpoint =>
            breakpoint.listener.addListener(e => handleMediaListeners(e, breakpoint.breakpoint)),
        );

    function handleMediaListeners(event: { matches: boolean; media: string }, key: Breakpoints) {
        if (!event.matches) return;

        Object.keys(breakpoints).forEach(
            (item: Breakpoints) =>
                (breakpoints[item].active = item === key ? event.matches : !event.matches),
        );

        callback(breakpoints);
    }

    callback(breakpoints);
};

export { breakpoints, min, max, useMedia, mediaWatcher, getCurrentBreakpoint, Breakpoints };
