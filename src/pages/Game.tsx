import { useState } from 'react';
import { calculatePoints } from '../logic/calculatePoints';
import allWords from '../logic/words.json';
import { useLocalStorage } from '@uidotdev/usehooks';

export const Game = ({
    players,
    newGame,
    updatePoints,
}: {
    players: Array<{
        name: string;
        points: number;
    }>;
    newGame: () => void;
    updatePoints: (
        index: number,
        getPoints: (prevPoints: number) => number
    ) => void;
}) => {
    const [input, setInput] = useState('');
    const [counter, setCounter] = useLocalStorage('counter', 0);

    const index = counter % players.length;
    const rounds = Math.floor(counter / players.length) + 1;

    const point = calculatePoints(input);

    // timer
    // multiple Blankos in one word
    // list of words / player
    // time / player!

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                const words = input.split(' ');
                const valid = words.every((w) => {
                    if (w.includes('_')) {
                        const [word, char] = w.split(':');
                        return allWords.includes(
                            char ? word.replace('_', char) : word
                        );
                    }
                    return allWords.includes(w);
                });

                if (valid || window.confirm('Biztos? Nem valid elvileg!')) {
                    updatePoints(index, (prevPoints) => prevPoints + point);
                    setCounter((prev) => prev + 1);
                    setInput('');
                }
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '210px',
            }}
        >
            <strong>
                {rounds}. kör: {players.at(index)?.name}
            </strong>
            <div>
                <input
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                />{' '}
                {point} pont
            </div>
            <div>
                <i>Több szó: szóközzel elválasztva</i>
            </div>
            <div>
                <i>Blankót tartalmazó szó: pél_a:d</i>
            </div>
            <table>
                <tr>
                    <th>Játékos</th>
                    <th>Pontszám</th>
                    <th>Módosít</th>
                </tr>
                {players.map((player, index) => (
                    <tr key={index}>
                        <td>{player.name}</td>
                        <td>{player.points}</td>
                        <td>
                            <div
                                style={{
                                    gap: '4px',
                                    paddingLeft: '4px',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        updatePoints(
                                            index,
                                            (prevPoints) => prevPoints + 1
                                        )
                                    }
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updatePoints(
                                            index,
                                            (prevPoints) => prevPoints - 1
                                        )
                                    }
                                >
                                    -
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </table>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Biztos?')) {
                        newGame();
                    }
                }}
            >
                Új játék
            </button>
        </form>
    );
};
