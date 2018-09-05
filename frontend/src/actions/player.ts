import { START, SUCCESS, ERROR } from 'actions/fetchStates';
import { Player } from 'reducers/player';

export const FETCH_ALL_PLAYERS = 'FETCH_ALL_PLAYERS';
export const CREATE_PLAYER = 'CREATE_PLAYER';
export const FETCH_PLAYER = 'FETCH_PLAYER';
export const DELETE_PLAYER = 'DELETE_PLAYER';
export const UPDATE_PLAYER = 'UPDATE_PLAYER';

//fetch all players
export function fetchAllPlayers() {
    return { type: FETCH_ALL_PLAYERS + START };
}

export function fetchAllPlayersSuccess(players: Player[]) {
    return { type: FETCH_ALL_PLAYERS + SUCCESS };
}

export function fetchAllPlayersError(message: string) {
    return { type: FETCH_ALL_PLAYERS + ERROR };
}

//fetch one player
export function fetchPlayer() {
    return { type: FETCH_PLAYER + START };
}

export function fetchPlayerSuccess(player: Player) {
    return { type: FETCH_PLAYER + SUCCESS, player };
}

export function fetchPlayerError(message: string) {
    return { type: FETCH_PLAYER + ERROR, message };
}

//create new player
export function createPlayer(player: Player) {
    return { type: CREATE_PLAYER + START, player };
}

export function createPlayerSuccess(player: Player) {
    return { type: CREATE_PLAYER + SUCCESS, player };
}

export function createPlayerError(message: string) {
    return { type: CREATE_PLAYER + ERROR, message };
}

//delete player
export function deletePlayer(player: Player) {
    return { type: DELETE_PLAYER + START, player };
}

export function deletePlayerSuccess(player: Player) {
    return { type: DELETE_PLAYER + SUCCESS, player };
}

export function deletePlayerError(message: string) {
    return { type: DELETE_PLAYER + ERROR, message };
}

//update player
export function updatePlayer(player: Player) {
    return { type: UPDATE_PLAYER + START, player };
}

export function updatePlayerSuccess(player: Player) {
    return { type: UPDATE_PLAYER + SUCCESS, player };
}

export function updatePlayerError(message: string) {
    return { type: UPDATE_PLAYER + ERROR, message };
}
