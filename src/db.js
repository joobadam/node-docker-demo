import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'todos.sqlite');

if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbFile);

db.pragma('journal_mode = WAL');

db.exec(`
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		completed INTEGER NOT NULL DEFAULT 0,
		createdAt TEXT NOT NULL,
		updatedAt TEXT NOT NULL
	);
`);

function nowIso() {
	return new Date().toISOString();
}

export function listTodos() {
	const stmt = db.prepare('SELECT id, title, completed, createdAt, updatedAt FROM todos ORDER BY id DESC');
	return stmt.all().map((row) => ({ ...row, completed: Boolean(row.completed) }));
}

export function getTodo(id) {
	const stmt = db.prepare('SELECT id, title, completed, createdAt, updatedAt FROM todos WHERE id = ?');
	const row = stmt.get(id);
	return row ? { ...row, completed: Boolean(row.completed) } : null;
}

export function createTodo({ title, completed = false }) {
	const createdAt = nowIso();
	const updatedAt = createdAt;
	const stmt = db.prepare('INSERT INTO todos (title, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?)');
	const info = stmt.run(title, completed ? 1 : 0, createdAt, updatedAt);
	return getTodo(info.lastInsertRowid);
}

export function updateTodo(id, { title, completed }) {
	const current = getTodo(id);
	if (!current) return null;
	const newTitle = typeof title === 'string' ? title : current.title;
	const newCompleted = typeof completed === 'boolean' ? (completed ? 1 : 0) : current.completed ? 1 : 0;
	const updatedAt = nowIso();
	const stmt = db.prepare('UPDATE todos SET title = ?, completed = ?, updatedAt = ? WHERE id = ?');
	stmt.run(newTitle, newCompleted, updatedAt, id);
	return getTodo(id);
}

export function deleteTodo(id) {
	const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
	const info = stmt.run(id);
	return info.changes > 0;
}

export function healthCheck() {
	try {
		const row = db.prepare('SELECT 1 as ok').get();
		return row && row.ok === 1;
	} catch {
		return false;
	}
}
