import { Dispatch, SetStateAction, useMemo } from 'react';

export const useArray = <T>(setArray: Dispatch<SetStateAction<Array<T>>>) => {
    return useMemo(
        () => ({
            push: (element: T) => setArray((prev) => [...prev, element]),
            clear: () => setArray([]),
            removeIndex: (index: number) =>
                setArray((prev) => prev.toSpliced(index, 1)),
            update: (
                index: number,
                element: T // TODO | ((prev: T) => T)
            ) => setArray((prev) => prev.toSpliced(index, 1, element)),
        }),
        [setArray]
    );
};
