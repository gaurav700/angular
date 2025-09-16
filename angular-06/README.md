## 🎨 Dynamic Styling

### ngStyle
Conditionally apply inline styles based on component properties.

```typescript
// Component
export class MyComponent {
  isActive = true;
  fontSize = 16;
  color = 'blue';
}
```

```html
<!-- Multiple styles -->
<div [ngStyle]="{
  'color': color,
  'font-size.px': fontSize,
  'font-weight': isActive ? 'bold' : 'normal'
}">
  Dynamic styles
</div>

<!-- Method-based styling -->
<div [ngStyle]="getStyles()">Content</div>
```

### ngClass
Dynamically apply CSS classes.

```html
<!-- Single class -->
<div [ngClass]="isActive ? 'active' : 'inactive'">Content</div>

<!-- Multiple classes -->
<div [ngClass]="{
  'active': isActive,
  'highlighted': isHighlighted,
  'disabled': !isEnabled
}">Content</div>

<!-- Array of classes -->
<div [ngClass]="['btn', 'primary', errorClass]">Button</div>

<!-- Method-based classes -->
<div [ngClass]="getClasses()">Content</div>
```

## 🔀 Conditional Rendering

### *ngIf
Show/hide elements based on conditions.

```html
<!-- Basic if -->
<div *ngIf="showContent">This content is conditional</div>

<!-- If-else -->
<div *ngIf="user; else noUser">
  Welcome, {{ user.name }}!
</div>
<ng-template #noUser>
  <div>Please log in</div>
</ng-template>

<!-- If-then-else -->
<div *ngIf="isLoading; then loadingBlock; else contentBlock"></div>
<ng-template #loadingBlock>Loading...</ng-template>
<ng-template #contentBlock>Content loaded!</ng-template>
```

### *ngSwitch
Multiple conditional branches like switch statement.

```typescript
// Component
status = 'pending'; // 'pending' | 'approved' | 'rejected'
```

```html
<div [ngSwitch]="status">
  <p *ngSwitchCase="'pending'" class="warning">Pending approval</p>
  <p *ngSwitchCase="'approved'" class="success">Approved</p>
  <p *ngSwitchCase="'rejected'" class="error">Rejected</p>
  <p *ngSwitchDefault>Unknown status</p>
</div>
```

## 🔄 Loops & Iteration

### *ngFor
Loop through arrays and objects.

```typescript
// Component
users = [
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false }
];
```

```html
<!-- Basic loop -->
<div *ngFor="let user of users">
  {{ user.name }}
</div>

<!-- With index and tracking -->
<div *ngFor="let user of users; let i = index; trackBy: trackByFn">
  {{ i + 1 }}. {{ user.name }}
</div>

<!-- Additional variables -->
<div *ngFor="let item of items; let isFirst = first; let isLast = last; let isEven = even">
  <span [ngClass]="{ 'first': isFirst, 'last': isLast, 'even': isEven }">
    {{ item }}
  </span>
</div>
```

```typescript
// TrackBy function for performance
trackByFn(index: number, item: any) {
  return item.id; // or index
}
```

## 🎯 Practical Examples

### Dynamic Button States
```html
<button 
  [ngClass]="{
    'btn-primary': type === 'primary',
    'btn-secondary': type === 'secondary',
    'loading': isLoading,
    'disabled': !isEnabled
  }"
  [ngStyle]="{
    'opacity': isEnabled ? 1 : 0.6,
    'cursor': isEnabled ? 'pointer' : 'not-allowed'
  }">
  <span *ngIf="!isLoading">{{ buttonText }}</span>
  <span *ngIf="isLoading">Loading...</span>
</button>
```

### Dynamic List with Filters
```html
<div class="filter-buttons">
  <button 
    *ngFor="let filter of filters"
    [ngClass]="{ 'active': currentFilter === filter }"
    (click)="setFilter(filter)">
    {{ filter }}
  </button>
</div>

<ul class="item-list">
  <li *ngFor="let item of filteredItems; trackBy: trackById"
      [ngClass]="{
        'completed': item.completed,
        'priority-high': item.priority === 'high'
      }">
    {{ item.name }}
  </li>
</ul>
```

### Status Indicator Component
```html
<div class="status-container">
  <div [ngSwitch]="connectionStatus" class="status-indicator">
    <div *ngSwitchCase="'connected'" 
         [ngStyle]="{ 'background-color': 'green' }">
      ✅ Connected
    </div>
    <div *ngSwitchCase="'connecting'" 
         [ngClass]="'pulsing'">
      🔄 Connecting...
    </div>
    <div *ngSwitchCase="'disconnected'" 
         [ngStyle]="{ 'color': 'red' }">
      ❌ Disconnected
    </div>
    <div *ngSwitchDefault>Unknown status</div>
  </div>
</div>
```

## 📝 Key Concepts

### Structural vs Attribute Directives
- **Structural** (`*ngIf`, `*ngFor`, `*ngSwitch`): Modify DOM structure
- **Attribute** (`ngClass`, `ngStyle`): Modify element properties

### Performance Tips
1. Use `trackBy` functions with `*ngFor` for better performance
2. Prefer `ngClass` over `ngStyle` when possible
3. Use `OnPush` change detection strategy for complex lists
4. Avoid complex expressions in templates

### Best Practices
1. Keep template logic simple
2. Use methods in component for complex calculations
3. Prefer reactive programming with observables
4. Use `async` pipe for observable data
5. Always handle null/undefined cases

### Method-Based Styling
```typescript
// Component methods for cleaner templates
getButtonClasses() {
  return {
    'btn-primary': this.isPrimary,
    'btn-large': this.size === 'large',
    'btn-disabled': this.disabled
  };
}

getStatusStyles() {
  return {
    'color': this.getStatusColor(),
    'font-weight': this.isImportant ? 'bold' : 'normal'
  };
}
```

## 🔧 Common Patterns

### Safe Navigation
```html
<!-- Prevent errors with null/undefined -->
<div *ngIf="user?.profile?.address">
  {{ user.profile.address.city }}
</div>
```

### Conditional Classes with Functions
```html
<div [ngClass]="getItemClasses(item)">{{ item.name }}</div>
```

### Multiple Conditions
```html
<div *ngIf="isLoggedIn && hasPermission && !isLoading">
  Protected content
</div>
```
