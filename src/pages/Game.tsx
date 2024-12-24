import { useEffect, useState } from 'react';
import { calculatePoints } from '../logic/calculatePoints';
import allWords from '../logic/words.json';
import { useLocalStorage } from '@uidotdev/usehooks';
import { LocalStorageKey } from '../enums/localStorageKey';

const threeMinsPast = new SpeechSynthesisUtterance(
    '3 perc eltelt! Jóvan mehet má!'
);
const fiveMinsPast = new SpeechSynthesisUtterance(
    '5 perc eltelt! Jólesz mostmá!'
);

const getWordsToCheckValidity = (input: string) => {
    return input
        .toLowerCase()
        .split(' ')
        .map((word) => {
            if (word.includes(':')) {
                const [w, c] = word.split(':');
                return c ? w.replace('_', c) : w;
            }
            return word;
        });
};

const getWordsToCalulatePoints = (input: string) => {
    return input
        .toLowerCase()
        .split(' ')
        .map((word) => {
            const [w] = word.split(':');
            return w;
        });
};

export const Game = ({
    players,
    newGame,
    updatePoints,
    updateTime,
}: {
    players: Array<{
        name: string;
        points: number;
        timeWasted: number;
    }>;
    newGame: () => void;
    updatePoints: (
        index: number,
        getPoints: (prevPoints: number) => number
    ) => void;
    updateTime: (index: number, addTime: number) => void;
}) => {
    const [input, setInput] = useState('');
    const [counter, setCounter] = useLocalStorage(LocalStorageKey.counter, 0);
    const [timer, setTimer] = useLocalStorage(LocalStorageKey.timer, 0);

    const index = counter % players.length;
    const rounds = Math.floor(counter / players.length) + 1;

    const point = getWordsToCalulatePoints(input).reduce(
        (acc, curr) => acc + calculatePoints(curr),
        0
    );

    // PWA
    // multiple Blankos in one word
    // stats: list of words & time / player

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [setTimer]);

    useEffect(() => {
        if (timer === 180) {
            speechSynthesis.speak(threeMinsPast);
        } else if (timer === 300) {
            speechSynthesis.speak(fiveMinsPast);
        }
    }, [timer]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                const valid = getWordsToCheckValidity(input).every((w) =>
                    allWords.includes(w)
                );

                if (valid || window.confirm('Biztos? Nem valid elvileg!')) {
                    updatePoints(index, (prevPoints) => prevPoints + point);
                    updateTime(index, timer);
                    setCounter((prev) => prev + 1);
                    setInput('');
                    setTimer(0);
                }
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '250px',
            }}
        >
            <div style={{ justifyContent: 'space-between' }}>
                <strong>
                    {rounds}. kör: {players.at(index)?.name}
                </strong>
                <div>{timer} mp</div>
            </div>
            <div style={{ gap: '4px' }}>
                <input
                    style={{ minWidth: '150px' }}
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                />
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
                    <th>Idő (p)</th>
                    <th>Pontszám</th>
                    <th>Módosít</th>
                </tr>
                {players.map((player, index) => (
                    <tr key={index}>
                        <td>{player.name}</td>
                        <td>{Math.round(player.timeWasted / 60)}</td>
                        <td>{player.points}</td>
                        <td>
                            <div
                                style={{
                                    gap: '4px',
                                    paddingLeft: '6px',
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
