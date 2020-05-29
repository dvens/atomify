export const PHASE_SYMBOL = Symbol('atomify.phase');

export const UPDATE_SYMBOL = Symbol('atomify.update');
export const DID_LOAD_SYMBOL = Symbol('atomify.didLoad');
export const DID_UNLOAD_SYMBOL = Symbol('atomify.didUnload');

export type Phase = typeof UPDATE_SYMBOL | typeof DID_LOAD_SYMBOL | typeof DID_UNLOAD_SYMBOL;
