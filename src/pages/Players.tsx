import { useArray } from '../hooks/useArray';
import { useForm } from '../hooks/useForm';
import { z } from 'zod';

export const Players = ({
    onSubmit,
}: {
    onSubmit: (players: Array<string>) => void;
}) => {
    const {
        values: players,
        setValues: setPlayers,
        errors,
        handleSubmit,
    } = useForm({
        schema: z
            .array(z.string().nonempty())
            .min(2)
            .refine((v) => new Set(v).size === v.length),
        defaultValues: [],
        onSubmit,
    });

    const { push, removeIndex, update } = useArray(setPlayers);

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '210px',
            }}
        >
            <div style={{ justifyContent: 'space-between' }}>
                <span>Játékosok</span>
                <button
                    onClick={() => push('')}
                    disabled={players.includes('')}
                >
                    +
                </button>
            </div>
            {players.map((player, index) => (
                <div
                    key={index}
                    style={{ gap: '4px' }}
                >
                    <input
                        autoFocus={true}
                        value={player}
                        onChange={(e) => update(index, e.currentTarget.value)}
                    />
                    <button
                        type="button"
                        onClick={() => removeIndex(index)}
                    >
                        -
                    </button>
                </div>
            ))}
            <button
                type="submit"
                disabled={Boolean(errors)}
            >
                Kezdés
            </button>
        </form>
    );
};
