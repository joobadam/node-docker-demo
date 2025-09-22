"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react"
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

type Todo = {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const baseUrl = useMemo(() => API_URL.replace(/\/$/, ""), [])

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const pending = total - completed
    return { total, completed, pending }
  }, [todos])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/todos`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load")
      const data: Todo[] = await res.json()
      setTodos(data)
    } catch (e) {
      toast.error("Failed to load todos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addTodo() {
    if (!title.trim()) return
    try {
      const res = await fetch(`${baseUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), completed: false }),
      })
      if (!res.ok) throw new Error("Create failed")
      setTitle("")
      await load()
      toast.success("Task added successfully")
    } catch (e) {
      toast.error("Failed to create task")
    }
  }

  async function toggleTodo(todo: Todo) {
    try {
      const res = await fetch(`${baseUrl}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      if (!res.ok) throw new Error("Update failed")
      await load()
      toast.success(todo.completed ? "Task marked as pending" : "Task completed!")
    } catch (e) {
      toast.error("Failed to update task")
    }
  }

  async function deleteTodo(id: number) {
    try {
      const res = await fetch(`${baseUrl}/todos/${id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("Delete failed")
      await load()
      toast.success("Task deleted")
    } catch (e) {
      toast.error("Failed to delete task")
    }
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedGradientBackground />
      <div className="relative z-10">
        <div className="border-b border-black/10">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-balance text-black">Task Manager</h1>
              <p className="text-lg text-black/70 max-w-2xl mx-auto text-pretty">
                Stay organized and productive with your personal task management system
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-black/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Circle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{stats.total}</p>
                  <p className="text-sm text-black/60">Total Tasks</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-black/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{stats.completed}</p>
                  <p className="text-sm text-black/60">Completed</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-black/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Circle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{stats.pending}</p>
                  <p className="text-sm text-black/60">Pending</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm border-black/10">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="title" className="sr-only">
                  New task
                </Label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTodo()
                  }}
                  className="h-12 text-base bg-white/50 border-black/20 focus:border-blue-500/50 text-black placeholder:text-black/50"
                />
              </div>
              <Button onClick={addTodo} size="lg" className="h-12 px-6 bg-black hover:bg-black/80 hover:scale-105 transition-all duration-200 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </Card>

          <div className="space-y-3">
            {loading && (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-black/10">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-black/70">Loading tasks...</span>
                </div>
              </Card>
            )}

            {!loading && todos.length === 0 && (
              <Card className="p-12 bg-white/80 backdrop-blur-sm border-black/10">
                <div className="text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-black/30 mx-auto" />
                  <h3 className="text-lg font-medium text-black/70">No tasks yet</h3>
                  <p className="text-sm text-black/50">Add your first task to get started</p>
                </div>
              </Card>
            )}

            {todos.map((todo, index) => (
              <Card
                key={todo.id}
                className="group p-4 bg-white/80 backdrop-blur-sm border-black/10 hover:bg-white/90 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleTodo(todo)} className="flex-shrink-0 transition-colors duration-200">
                    {todo.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-black/50 hover:text-blue-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-base transition-all duration-200 ${
                        todo.completed ? "line-through text-black/50" : "text-black"
                      }`}
                    >
                      {todo.title}
                    </p>
                    <p className="text-xs text-black/40 mt-1">{new Date(todo.createdAt).toLocaleDateString()}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
