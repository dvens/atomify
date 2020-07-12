export const PHASE_SYMBOL = Symbol('atomify.phase');
export const SIDE_EFFECT_PHASE_SYMBOL = Symbol('atomify.sideEffectPhase');

export const UPDATE_SYMBOL = Symbol('atomify.update');
export const DID_LOAD_SYMBOL = Symbol('atomify.didLoad');
export const DID_UNLOAD_SYMBOL = Symbol('atomify.didUnload');
export const CSS_SAVE_TOKEN = Symbol('atomify.cssSaveToken');
export const REFLECTING_TO_ATTRIBUTE = Symbol('atomify.reflectingToAttribute');
export const REFLECTING_TO_PROPERTY = Symbol('atomify.reflectingToProperty');

export type Phase =
    | typeof REFLECTING_TO_ATTRIBUTE
    | typeof REFLECTING_TO_PROPERTY
    | typeof UPDATE_SYMBOL
    | typeof DID_LOAD_SYMBOL
    | typeof DID_UNLOAD_SYMBOL;

export type SideEffectPhase = typeof REFLECTING_TO_ATTRIBUTE | typeof REFLECTING_TO_PROPERTY;
