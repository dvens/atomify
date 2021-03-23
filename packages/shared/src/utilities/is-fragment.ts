export type FragmentType = typeof DocumentFragment;

export const isFragment = (type: FragmentType): type is FragmentType => {
    return type === DocumentFragment;
};
