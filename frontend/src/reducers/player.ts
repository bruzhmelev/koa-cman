import { FETCH_PLAYER, CREATE_PLAYER, UPDATE_PLAYER } from '../actions/player';
import { ERROR, START, SUCCESS } from '../actions/fetchStates';

export interface Player {
    _id: string | null;
    name: string;
    avaImgUrl: string;
    email: string;
    bestScore: number;
    tryNumber: number;
    achives: {
        oneGameFinished: boolean;
    };
}

interface PlayerState {
    player: Player;
    loading: boolean;
    loaded: boolean;
    saving: boolean;
    saved: boolean;
}

export const PLAYER_DEFAULT_STATE: PlayerState = {
    player: {
        _id: null,
        name: 'Default Player',
        avaImgUrl: 'https://api.adorable.io/avatars/40/abott@adorable.png',
        email: 'example@mail.com',
        bestScore: 99192,
        tryNumber: 3,
        achives: { oneGameFinished: true },
    },
    loading: false,
    loaded: false,
    saving: false,
    saved: false,
};

export default function player(state: PlayerState = PLAYER_DEFAULT_STATE, action: any) {
    switch (action.type) {
        case FETCH_PLAYER: {
            return { ...state, loading: true };
        }

        case FETCH_PLAYER + SUCCESS:
            return { ...state, ...action.player, loading: false };

        case CREATE_PLAYER:
        case UPDATE_PLAYER:
            return { ...state, saving: true };

        case CREATE_PLAYER + SUCCESS:
        case UPDATE_PLAYER + SUCCESS:
            return { ...state, ...action.player, saving: false };

        default:
            return state;
    }
}
