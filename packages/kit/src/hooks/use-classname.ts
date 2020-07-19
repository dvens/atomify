import { createHook } from '@atomify/hooks';
import { classNames } from '@atomify/jsx';

type ClassName = string | { [key: string]: boolean } | false | null | undefined;

interface ClassNames {
    (value: Element): void;
    add(...tokens: string[]): void;
    remove(...tokens: string[]): void;
    toggle(token: string, force?: boolean): void;
    contains(token: string): boolean;
}

export const useClassname = (initialValue?: ClassName) =>
    createHook<ClassNames>({
        onDidLoad: () => {
            const holder = document.createElement('div');

            if (initialValue != null) {
                holder.className = classNames(initialValue);
            }

            let holderClassList = holder.classList;

            function ClassList(element: Element) {
                element.className = holderClassList.value;
                holderClassList = element.classList;
            }

            Object.defineProperties(
                ClassList,
                Object.getOwnPropertyDescriptors({
                    add(...tokens: string[]) {
                        holderClassList.add(...tokens);
                    },
                    remove(...tokens: string[]) {
                        holderClassList.remove(...tokens);
                    },
                    toggle(token: string, force?: boolean) {
                        holderClassList.toggle(token, force);
                    },
                    contains(token: string) {
                        return holderClassList.contains(token);
                    },
                }),
            );

            return ClassList as ClassNames;
        },
    });
