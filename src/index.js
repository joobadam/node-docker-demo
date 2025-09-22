import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import todosRouter from './routes/todos.js';
import { healthCheck } from './db.js';

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const httpLogger = pinoHttp({ logger });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.get('/healthz', (req, res) => {
	const ok = healthCheck();
	if (!ok) return res.status(500).json({ status: 'unhealthy' });
	res.json({ status: 'ok' });
});

app.use('/todos', todosRouter);

app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
	logger.info({ port }, 'Server listening');
});
