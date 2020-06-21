import { Component, defineElement, FC, RenderFunction } from './component';
import { adoptStyles, css, scopeCSS, unsafeCSS } from './css';
import {
    createHook,
    getCurrentElement,
    getCurrentElementPhase,
    onDidLoad,
    onDidUnload,
    onUpdated,
    useBindMethod,
    useEvent,
    useListen,
    useProp,
    useQuery,
    useQueryAll,
    useRef,
    useStyles,
} from './hooks';
import { queueMicrotaskPolyfill } from './polyfills';
import { scheduleMacrotask, scheduleMicrotask, supportsAdoptingStyleSheets } from './utilities';

export {
    defineElement,
    RenderFunction,
    useRef,
    useProp,
    scopeCSS,
    adoptStyles,
    unsafeCSS,
    css,
    Component,
    onDidLoad,
    onDidUnload,
    onUpdated,
    useBindMethod,
    useQuery,
    useQueryAll,
    useStyles,
    useEvent,
    useListen,
    createHook,
    getCurrentElement,
    getCurrentElementPhase,
    queueMicrotaskPolyfill,
    supportsAdoptingStyleSheets,
    scheduleMacrotask,
    scheduleMicrotask,
    FC,
};
