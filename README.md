# Node Docker Todo API (JavaScript)

Simple Express + SQLite (better-sqlite3) Todo API.

## Run locally

```bash
npm install
npm run dev
# or
npm start
```

- Healthcheck: `GET http://localhost:3000/healthz`
- List: `GET http://localhost:3000/todos`
- Get by id: `GET http://localhost:3000/todos/1`
- Create: `POST http://localhost:3000/todos` JSON: `{ "title": "Task", "completed": false }`
- Update: `PUT http://localhost:3000/todos/1` JSON: `{ "title": "New", "completed": true }`
- Delete: `DELETE http://localhost:3000/todos/1`

## Notes
- Data stored in `data/todos.sqlite`
- Logs are JSON (pino). For pretty logs: `LOG_LEVEL=info` and pipe through `pino-pretty` if needed.
