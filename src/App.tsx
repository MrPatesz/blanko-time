import './App.css';

import { Game } from './pages/Game';
import { Route } from './enums/route';
import { Players } from './pages/Players';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';

export const App = () => {
    const [route, setRoute] = useLocalStorage<Route>('page', Route.players);
    const [players, setPlayers] = useLocalStorage<
        Array<{
            name: string;
            points: number;
        }>
    >('players', []);

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
                            players.map((name) => ({ name, points: 0 }))
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
                />
            );
        }
        default: {
            return route satisfies never;
        }
    }
};
