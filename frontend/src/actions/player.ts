export const NEW_PLAYER = 'NEW_PLAYER';
export const FETCH_PLAYER = 'FETCH_PLAYER';
export const UPDATE_PLAYER_INFO = 'UPDATE_PLAYER_INFO';

// action creators
export function newPlayer() {
    return { type: NEW_PLAYER };
}

export function addTodoSuccess(id: string) {
    return { type: FETCH_PLAYER, id };
}

export function updatePlayerInfo(playerInfo: any) {
    return { type: UPDATE_PLAYER_INFO, playerInfo };
}
