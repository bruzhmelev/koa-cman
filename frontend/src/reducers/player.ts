import { FETCH_PLAYER, NEW_PLAYER, UPDATE_PLAYER_INFO } from '../actions/player';
import { ERROR, START, SUCCESS } from '../actions/fetchStates';

export const PLAYER_DEFAULT_STATE = {
    info: {
        name: 'Default Player',
        avaImgUrl: 'https://api.adorable.io/avatars/40/abott@adorable.png',
        email: 'example@mail.com',
        bestScore: 99192,
        tryNumber: 3,
        achives: {
            oneGameFinished: true,
        },
    },
    loading: false,
    saving: false,
};

export default function player(state = PLAYER_DEFAULT_STATE, action: any) {
    switch (action.type) {
        case FETCH_PLAYER: {
            return { ...state, loading: true };
        }

        case FETCH_PLAYER + SUCCESS:
            return { ...state, ...action.player, loading: false };

        case NEW_PLAYER:
        case UPDATE_PLAYER_INFO:
            return { ...state, saving: true };

        case NEW_PLAYER + SUCCESS:
        case UPDATE_PLAYER_INFO + SUCCESS:
            return { ...state, ...action.player, saving: false };

        default:
            return state;
    }
}
