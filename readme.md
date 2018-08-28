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
