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
  - // TODO: После каждого действия нужно куда-то ходить сохранять состояние model
  - // TODO: REFACTORING. Каждый раз гонять модель целиком по сети при том в таком виде как она есть сейчас это жесть.
- Moving State Management to Redux
  - Typing for every action in reducer
  - Flow our new Redux actions through our UI
- Moving all side-effect to sagas
- auth

  - app.keys = ['super-secret-key']; - In production, make sure to update the secret key, app.keys. For example, you can use Python to generate a secure key:
  - require('./auth');
  - ./auth `const fetchUser = (() => {`
  - bcryptjs

    ```
    const bcrypt = require('bcryptjs');

    function comparePass(userPassword, databasePassword) {
      return bcrypt.compareSync(userPassword, databasePassword);
    }
    ```

  - current stage `https://mherman.org/blog/user-authentication-with-passport-and-koa/` Logout

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

## Heroku

https://protected-coast-80963.herokuapp.com/v1/auth/facebook

git remote -v

```
heroku  https://git.heroku.com/protected-coast-80963.git (fetch)
heroku  https://git.heroku.com/protected-coast-80963.git (push)
origin  git@github.com:bruzhmelev/koa-cman.git (fetch)
origin  git@github.com:bruzhmelev/koa-cman.git (push)
```

git push heroku master
heroku logs --tail

heroku config:set NODE_ENVIRONMENT=production

## Docker

Билд бэкенда:

```bash
docker build -t cman-backend .
```

Запуск контейнера бэкенда:

```bash
docker run --rm -p 4000:4000 -ti --env-file .env cman-backend
```

Запуск bash в контейнере бэкенда:

```bash
docker run --rm -p 4000:4000 -ti --env-file .env cman-backend bash
```
