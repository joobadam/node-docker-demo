import { Router } from 'express';
import { listTodos, getTodo, createTodo, updateTodo, deleteTodo } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
	const items = listTodos();
	res.json(items);
});

router.get('/:id', (req, res) => {
	const id = Number(req.params.id);
	if (Number.isNaN(id)) {
		return res.status(400).json({ error: 'Invalid id' });
	}
	const item = getTodo(id);
	if (!item) return res.status(404).json({ error: 'Not found' });
	res.json(item);
});

router.post('/', (req, res) => {
	const { title, completed } = req.body ?? {};
	if (typeof title !== 'string' || title.trim().length === 0) {
		return res.status(400).json({ error: 'Title is required' });
	}
	const item = createTodo({ title: title.trim(), completed: Boolean(completed) });
	res.status(201).json(item);
});

router.put('/:id', (req, res) => {
	const id = Number(req.params.id);
	if (Number.isNaN(id)) {
		return res.status(400).json({ error: 'Invalid id' });
	}
	const { title, completed } = req.body ?? {};
	if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
		return res.status(400).json({ error: 'Invalid title' });
	}
	if (completed !== undefined && typeof completed !== 'boolean') {
		return res.status(400).json({ error: 'Invalid completed flag' });
	}
	const item = updateTodo(id, { title, completed });
	if (!item) return res.status(404).json({ error: 'Not found' });
	res.json(item);
});

router.delete('/:id', (req, res) => {
	const id = Number(req.params.id);
	if (Number.isNaN(id)) {
		return res.status(400).json({ error: 'Invalid id' });
	}
	const ok = deleteTodo(id);
	if (!ok) return res.status(404).json({ error: 'Not found' });
	res.status(204).send();
});

export default router;
