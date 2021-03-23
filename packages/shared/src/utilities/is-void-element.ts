export const VOID_ELEMENTS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;
export const isVoidElement = (name: any) => String(name).match(VOID_ELEMENTS);
