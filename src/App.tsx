import './App.css';

import { Game } from './pages/Game';
import { Route } from './enums/route';
import { Players } from './pages/Players';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { LocalStorageKey } from './enums/localStorageKey';

export const App = () => {
    const [route, setRoute] = useLocalStorage<Route>(
        LocalStorageKey.page,
        Route.players
    );
    const [players, setPlayers] = useLocalStorage<
        Array<{
            name: string;
            points: number;
            timeWasted: number;
        }>
    >(LocalStorageKey.players, []);

    useEffect(() => {
        if (route === Route.players) {
            localStorage.clear();
        }
    }, [route]);

    switch (route) {
        case Route.players: {
            return (
                <Players
                    onSubmit={(players) => {
                        setPlayers(
                            players.map((name) => ({
                                name,
                                points: 0,
                                timeWasted: 0,
                            }))
                        );
                        setRoute(Route.game);
                    }}
                />
            );
        }
        case Route.game: {
            return (
                <Game
                    players={players}
                    newGame={() => setRoute(Route.players)}
                    updatePoints={(index, getPoints) =>
                        setPlayers((prev) => {
                            const prevPlayer = prev.at(index);
                            if (!prevPlayer) {
                                return prev;
                            }
                            return prev.toSpliced(index, 1, {
                                ...prevPlayer,
                                points: getPoints(prevPlayer.points),
                            });
                        })
                    }
                    updateTime={(index, addTime) =>
                        setPlayers((prev) => {
                            const prevPlayer = prev.at(index);
                            if (!prevPlayer) {
                                return prev;
                            }
                            return prev.toSpliced(index, 1, {
                                ...prevPlayer,
                                timeWasted: prevPlayer.timeWasted + addTime,
                            });
                        })
                    }
                />
            );
        }
        default: {
            return route satisfies never;
        }
    }
};
