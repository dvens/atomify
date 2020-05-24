export const phaseSymbol = Symbol('atomify.phase');

export const updateSymbol = Symbol('atomify.update');
export const connectingSymbol = Symbol('atomify.connecting');
export const disconnectedSymbol = Symbol('atomify.disconnecting');

export type Phase = typeof updateSymbol | typeof connectingSymbol | typeof disconnectedSymbol;
