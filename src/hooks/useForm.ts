import { FormEvent, useMemo, useState } from 'react';
import { z } from 'zod';

export const useForm = <T extends NonNullable<unknown>>({
    schema,
    defaultValues,
    onSubmit,
}: {
    schema: z.Schema<T>;
    defaultValues: T;
    onSubmit: (values: T) => void;
}) => {
    const [values, setValues] = useState(defaultValues);

    const errors = useMemo(
        () => schema.safeParse(values).error,
        [schema, values]
    );

    return {
        values,
        errors,
        setValues,
        handleSubmit: (e: FormEvent) => {
            e.preventDefault();
            onSubmit(values);
        },
    };
};
