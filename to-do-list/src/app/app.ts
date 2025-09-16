import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number;
}

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  protected readonly title = signal('to-do-list');
  todos: Todo[] = [];
  newTitle = '';
  editingId: number | null = null;
  editBuffer = '';
  filter: Filter = 'all';

  private storageKey = 'ng_todos_v1';

  constructor() {
    this.load();
  }

  add() {
    const title = this.newTitle.trim();
    if (!title) return;
    const todo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: Date.now()
    };
    this.todos = [todo, ...this.todos];
    this.newTitle = '';
    this.save();
  }

  toggle(todo: Todo) {
    todo.completed = !todo.completed;
    this.save();
  }

  remove(todo: Todo) {
    this.todos = this.todos.filter(t => t.id !== todo.id);
    if (this.editingId === todo.id) this.cancelEdit();
    this.save();
  }

  startEdit(todo: Todo) {
    this.editingId = todo.id;
    this.editBuffer = todo.title;
    // small timeout to focus input if needed (template handles autofocus via ngIf)
  }

  saveEdit(todo: Todo) {
    const title = this.editBuffer.trim();
    if (!title) {
      // if user cleared title, delete the todo
      this.remove(todo);
      return;
    }
    todo.title = title;
    this.editingId = null;
    this.editBuffer = '';
    this.save();
  }

  cancelEdit() {
    this.editingId = null;
    this.editBuffer = '';
  }

  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.save();
  }

  toggleAll(checked: boolean) {
    this.todos = this.todos.map(t => ({ ...t, completed: checked }));
    this.save();
  }

  setFilter(f: Filter) {
    this.filter = f;
  }

  get filteredTodos(): Todo[] {
    if (this.filter === 'active') return this.todos.filter(t => !t.completed);
    if (this.filter === 'completed') return this.todos.filter(t => t.completed);
    return this.todos;
  }

  remainingCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (e) {
      console.warn('Failed to save todos:', e);
    }
  }

  private load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Todo[];
      // basic validation
      if (Array.isArray(parsed)) this.todos = parsed;
    } catch (e) {
      console.warn('Failed to load todos:', e);
    }
  }
}
