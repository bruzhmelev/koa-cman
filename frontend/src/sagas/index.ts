import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import {
    CREATE_PLAYER,
    FETCH_PLAYER,
    FETCH_ALL_PLAYERS,
    UPDATE_PLAYER,
    fetchAllPlayersSuccess,
    fetchAllPlayersError,
    fetchPlayerSuccess,
    fetchPlayerError,
    createPlayerSuccess,
    createPlayerError,
    deletePlayerError,
    deletePlayerSuccess,
    DELETE_PLAYER,
    updatePlayerError,
    updatePlayerSuccess,
} from 'actions/player';
import { START, SUCCESS, ERROR } from 'actions/fetchStates';
import { Player } from 'reducers/player';

function* fetchAllPlayers() {
    try {
        const res = yield call(fetch, 'v1/players');
        const players = yield res.json();
        yield put(fetchAllPlayersSuccess(players));
    } catch (e) {
        yield put(fetchAllPlayersError(e.message));
    }
}

function* fetchPlayer(action: any) {
    try {
        const res = yield call(fetch, `v1/players/${action.id}`);
        const player = yield res.json();
        yield put(fetchPlayerSuccess(player));
    } catch (e) {
        yield put(fetchPlayerError(e.message));
    }
}

function* createPlayer(action: { type: string; player: Player }) {
    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(action.player),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        };

        const res = yield call(fetch, 'v1/players', options);
        const player = yield res.json();
        yield put(createPlayerSuccess(player));
    } catch (e) {
        yield put(createPlayerError(e.message));
    }
}

function* deletePlayer(action: { type: string; player: Player }) {
    try {
        yield call(fetch, `v1/players/${action.player._id}`, { method: 'DELETE' });
        yield put(deletePlayerSuccess(action.player));
    } catch (e) {
        yield put(deletePlayerError(e.message));
    }
}

function* updatePlayer(action: { type: string; player: Player }) {
    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(action.player),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        };
        const res = yield call(fetch, `v1/players/${action.player._id}`, options);
        const player = yield res.json();
        yield put(updatePlayerSuccess(player));
    } catch (e) {
        yield put(updatePlayerError(e.message));
    }
}

function* rootSaga() {
    yield takeLatest(FETCH_ALL_PLAYERS + START, fetchAllPlayers);
    yield takeLatest(FETCH_PLAYER + START, fetchPlayer);
    yield takeLatest(CREATE_PLAYER + START, createPlayer);
    yield takeLatest(DELETE_PLAYER + START, deletePlayer);
    yield takeLatest(UPDATE_PLAYER + START, updatePlayer);
}

export default rootSaga;
