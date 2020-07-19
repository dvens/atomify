export * from './component';
export * from './property';
export * from './events';

declare global {
    interface Window {
        ShadyCSS: any;
    }
}
