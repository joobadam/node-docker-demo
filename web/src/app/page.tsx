"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type Todo = {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
};

export default function HomePage() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);

	const baseUrl = useMemo(() => API_URL.replace(/\/$/, ""), []);

	async function load() {
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/todos`, { cache: "no-store" });
			if (!res.ok) throw new Error("Failed to load");
			const data: Todo[] = await res.json();
			setTodos(data);
		} catch (e) {
			toast.error("Hiba a teendők betöltésekor");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function addTodo() {
		if (!title.trim()) return;
		try {
			const res = await fetch(`${baseUrl}/todos`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: title.trim(), completed: false }),
			});
			if (!res.ok) throw new Error("Create failed");
			setTitle("");
			await load();
		} catch (e) {
			toast.error("Hiba létrehozáskor");
		}
	}

	async function toggleTodo(todo: Todo) {
		try {
			const res = await fetch(`${baseUrl}/todos/${todo.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ completed: !todo.completed }),
			});
			if (!res.ok) throw new Error("Update failed");
			await load();
		} catch (e) {
			toast.error("Hiba frissítéskor");
		}
	}

	async function deleteTodo(id: number) {
		try {
			const res = await fetch(`${baseUrl}/todos/${id}`, { method: "DELETE" });
			if (!res.ok && res.status !== 204) throw new Error("Delete failed");
			await load();
		} catch (e) {
			toast.error("Hiba törléskor");
		}
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<Toaster />
			<h1 className="text-2xl font-bold mb-4">Todo alkalmazás</h1>
			<div className="flex gap-2 mb-6">
				<Label htmlFor="title" className="sr-only">
					Új teendő
				</Label>
				<Input
					id="title"
					placeholder="Írd be a teendőt..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") addTodo();
					}}
				/>
				<Button onClick={addTodo}>Hozzáadás</Button>
			</div>

			<div className="space-y-2">
				{loading && <p>Betöltés...</p>}
				{!loading && todos.length === 0 && <p>Nincs teendő.</p>}
				{todos.map((t) => (
					<Card key={t.id} className="p-3 flex items-center justify-between">
						<label className="flex items-center gap-3">
							<Checkbox checked={t.completed} onCheckedChange={() => toggleTodo(t)} />
							<span className={t.completed ? "line-through text-muted-foreground" : ""}>{t.title}</span>
						</label>
						<Button variant="destructive" onClick={() => deleteTodo(t.id)}>
							Törlés
						</Button>
					</Card>
				))}
			</div>
		</div>
	);
}
