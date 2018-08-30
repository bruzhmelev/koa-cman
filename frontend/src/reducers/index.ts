import { combineReducers } from 'redux';
import player, { PLAYER_DEFAULT_STATE } from './player';

const cmanApp = combineReducers({
    player,
});

export const DEFAULT_STATE = { player: PLAYER_DEFAULT_STATE };

export default cmanApp;
