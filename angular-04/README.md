This repository demonstrates the implementation and usage of Angular Signals, a powerful reactive programming feature introduced in Angular 16+ that provides fine-grained reactivity for better performance and developer experience.

## Table of Contents

- [What are Signals?](#what-are-signals)
- [Types of Signals](#types-of-signals)
- [Signal Data Types](#signal-data-types)
- [Updating Signal Values](#updating-signal-values)
- [Computed Signals](#computed-signals)
- [Effects in Angular](#effects-in-angular)
- [Code Examples](#code-examples)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Best Practices](#best-practices)

## What are Signals?

Signals are a reactive primitive in Angular that represent a value that can change over time. When a signal's value changes, it automatically notifies any consumers (like templates, computed signals, or effects) that depend on it.

### Key Features:
- **Reactive**: Automatically updates consumers when values change
- **Fine-grained**: Only updates what actually needs to be updated
- **Type-safe**: Full TypeScript support
- **Efficient**: Better performance compared to Zone.js change detection
- **Simple**: Easy to understand and use

## Types of Signals

### 1. Writable Signals
Basic signals that can be read and written to directly.

```typescript
import { signal } from '@angular/core';

// Create a writable signal
const counter = signal(0);
const userName = signal('John Doe');
const isLoading = signal(false);
```

### 2. Read-only Signals
Signals that can only be read, typically created from computed signals or as readonly views.

```typescript
import { computed, signal } from '@angular/core';

const count = signal(10);
const readOnlyCount = count.asReadonly();
```

### 3. Computed Signals
Derived signals that automatically recalculate when their dependencies change.

```typescript
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);
```

## Signal Data Types

Signals can hold any TypeScript data type:

### Primitive Types
```typescript
// Number
const age = signal<number>(25);
const price = signal(99.99);

// String
const name = signal<string>('Angular');
const message = signal('Hello World');

// Boolean
const isVisible = signal<boolean>(true);
const isCompleted = signal(false);
```

### Object Types
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user = signal<User>({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
});

// Array types
const numbers = signal<number[]>([1, 2, 3, 4, 5]);
const users = signal<User[]>([]);
```

### Complex Types
```typescript
interface AppState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const appState = signal<AppState>({
  loading: false,
  data: [],
  error: null
});
```

## Updating Signal Values

### 1. Set Method
Replaces the entire signal value:

```typescript
const counter = signal(0);

// Set new value
counter.set(10);

const user = signal({ name: 'John', age: 30 });
// Replace entire object
user.set({ name: 'Jane', age: 25 });
```

### 2. Update Method
Updates the signal value based on the current value:

```typescript
const counter = signal(0);

// Increment counter
counter.update(value => value + 1);

// Decrement counter
counter.update(value => value - 1);

const user = signal({ name: 'John', age: 30 });
// Update specific property
user.update(current => ({ ...current, age: current.age + 1 }));
```

### 3. Mutate Method (for objects and arrays)
Mutates the signal value in place:

```typescript
const items = signal([1, 2, 3]);

// Add item to array
items.mutate(arr => arr.push(4));

const user = signal({ name: 'John', age: 30 });
// Mutate object property
user.mutate(u => u.age = 31);
```

## Computed Signals

### What are Computed Signals?

Computed signals are read-only signals that derive their value from other signals. They automatically recalculate when any of their dependencies change.

### Examples of Computed Signals

```typescript
import { signal, computed } from '@angular/core';

// Basic computed signal
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

// Complex computed signal
const items = signal([
  { name: 'Item 1', price: 10, quantity: 2 },
  { name: 'Item 2', price: 15, quantity: 1 },
  { name: 'Item 3', price: 20, quantity: 3 }
]);

const totalPrice = computed(() => 
  items().reduce((total, item) => total + (item.price * item.quantity), 0)
);

const expensiveItems = computed(() => 
  items().filter(item => item.price > 15)
);

// Computed signal depending on multiple sources
const tax = signal(0.1);
const finalPrice = computed(() => totalPrice() * (1 + tax()));
```

### Why Computed Signals are Important

1. **Automatic Updates**: Recalculate only when dependencies change
2. **Performance**: Memoized results - only recalculate when necessary
3. **Declarative**: Express derived state clearly
4. **Composable**: Can depend on other computed signals
5. **Type Safety**: Full TypeScript support

## Effects in Angular

### What are Effects?

Effects are functions that run when one or more signals change. They're useful for side effects like logging, API calls, or DOM manipulation.

### Basic Effect Usage

```typescript
import { effect, signal } from '@angular/core';

const counter = signal(0);

// Effect that runs when counter changes
effect(() => {
  console.log('Counter value:', counter());
});

// Effect with cleanup
effect((onCleanup) => {
  const subscription = someObservable.subscribe();
  
  onCleanup(() => {
    subscription.unsubscribe();
  });
});
```

### Getting Updated Signals in Effects

```typescript
import { effect, signal, computed } from '@angular/core';

const user = signal({ name: 'John', age: 30 });
const preferences = signal({ theme: 'dark', language: 'en' });

// Effect that responds to user changes
effect(() => {
  const currentUser = user();
  console.log('User updated:', currentUser);
  
  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(currentUser));
});

// Effect that responds to multiple signals
effect(() => {
  const currentUser = user();
  const currentPrefs = preferences();
  
  console.log('User or preferences updated:', {
    user: currentUser,
    preferences: currentPrefs
  });
  
  // Sync to server
  syncUserData(currentUser, currentPrefs);
});

// Effect with computed signal
const isAdult = computed(() => user().age >= 18);

effect(() => {
  if (isAdult()) {
    console.log('User is an adult');
    enableAdultFeatures();
  } else {
    console.log('User is a minor');
    disableAdultFeatures();
  }
});
```

## Code Examples

### Complete Component Example

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <h2>Counter: {{ counter() }}</h2>
      <h3>Double: {{ doubleCounter() }}</h3>
      <h3>Status: {{ status() }}</h3>
      
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterComponent {
  // Writable signal
  counter = signal(0);
  
  // Computed signals
  doubleCounter = computed(() => this.counter() * 2);
  status = computed(() => 
    this.counter() > 0 ? 'Positive' : 
    this.counter() < 0 ? 'Negative' : 'Zero'
  );
  
  constructor() {
    // Effect to log changes
    effect(() => {
      console.log('Counter changed to:', this.counter());
    });
  }
  
  increment() {
    this.counter.update(value => value + 1);
  }
  
  decrement() {
    this.counter.update(value => value - 1);
  }
  
  reset() {
    this.counter.set(0);
  }
}
```


