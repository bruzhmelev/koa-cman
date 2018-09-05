# README

## Запуск

### Бекенд и фротенд запуск локально

1. Скопировать образец из backend/.env.sample в backend/.env и указать недостающие секреты
1. DB_PASSWORD='password' спросить лично или посмотреть в Azure для БД cman

```
npm run install-all
npm start
```

API бекенда запустится:

`http://localhost:4000/v1/players`

Фронт откроется:

`http://localhost:3000/`

### Для прод билда

```
npm run build
```

## Todo

- Fetching data from backend (
  player {name, bestScore}
  playerActions (allocatePoint, rest, startOrder, finishOrder, addOrder, goHome, startTrip, makeChoice, next))
- Moving State Management to Redux
  -- Typing for every action in reducer
- Moving all sideeffect to sagas

## Issues

- DEFAULT_STATE `Argument of type '{ player: ... is not assignable to parameter of type 'DeepPartial<{ player: any; }>'.`
- [Error] `[nodemon] app crashed - waiting for file changes before starting...` Проходит, если на любом файле из бекенда нажать Ctrl+S

## Postman

Для Postman запросы будут складываться в `backend/postman`

## We have a functional backend with CRUD operations talking to our database. Examples:

GET /v1/players -> Returns all players in database

POST /v1/players -> Create new player

POST /v1/players/[ObjectId] -> Update player with id of 1

```
response

{
    "_id": "5b85b11ae56b33431ec99799",
    "createdAt": "2018-08-28T20:31:22.215Z",
    "updatedAt": "2018-08-28T20:31:22.215Z",
    "__v": 0
}
```

DELETE /v1/players/1 -> Delete player with id of 1
