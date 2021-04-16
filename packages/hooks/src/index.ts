import { Component, defineElement, FCE, RenderFunction, setupDefaultRender } from './component';
import {
    createHook,
    getCurrentElement,
    getCurrentElementPhase,
    onDidLoad,
    onDidUnload,
    onUpdated,
    useBindMethod,
    useComputed,
    useElement,
    useElements,
    useEvent,
    useListen,
    useProp,
    useReactive,
    useRef,
    useWatch,
} from './hooks';
import { queueMicrotaskPolyfill } from './polyfills';

export {
    defineElement,
    RenderFunction,
    setupDefaultRender,
    useRef,
    useProp,
    Component,
    onDidLoad,
    onDidUnload,
    onUpdated,
    useBindMethod,
    useElement,
    useElements,
    useEvent,
    useListen,
    createHook,
    getCurrentElement,
    getCurrentElementPhase,
    queueMicrotaskPolyfill,
    FCE,
    useReactive,
    useWatch,
    useComputed,
};
