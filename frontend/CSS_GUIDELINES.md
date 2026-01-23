# CSS Architecture Guidelines

## Overview

This project uses a **component-scoped CSS architecture** to prevent global style conflicts. All component-specific styles must be scoped under a unique wrapper class.

## Global vs Component CSS

### Global CSS (`index.css`)
**Location**: `src/index.css`

**What goes here:**
- CSS variable definitions (`:root`)
- Material Icons styles (used across all components)
- Base HTML element styles (`*, html, body`)
- Truly global utilities

**Example:**
```css
:root {
  --primary: #ea2a33;
  --success: #07885d;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  /* ... */
}
```

### Component CSS

**Rule**: Every component CSS file MUST scope all selectors under a unique wrapper class.

**Naming Convention:**
- Home page: `.home-page`
- Teacher Dashboard: `.teacher-page`
- Product page: `.product-page`
- Auth pages: `.auth-page`

## How to Create Component CSS

### 1. Create the CSS File

**File**: `src/css/MyComponent.css`

```css
/* MyComponent Styles - All scoped under .my-component-page */

.my-component-page .header {
  background-color: var(--primary);
}

.my-component-page .content {
  padding: 2rem;
}

.my-component-page .button {
  color: white;
}

/* Dark mode - also scoped */
.my-component-page.dark .header {
  background-color: var(--background-dark);
}
```

### 2. Update the Component

**File**: `src/pages/MyComponent.jsx`

```javascript
import './css/MyComponent.css';

export default function MyComponent() {
  return (
    <div className="my-component-page">
      <header className="header">...</header>
      <main className="content">
        <button className="button">Click me</button>
      </main>
    </div>
  );
}
```

## Common Mistakes to Avoid

### ❌ DON'T: Define global selectors in component CSS

```css
/* BAD - This affects ALL headers in the app */
.header {
  background: red;
}

/* BAD - This affects ALL buttons */
button {
  color: blue;
}
```

### ✅ DO: Scope all selectors

```css
/* GOOD - Only affects this component */
.my-component-page .header {
  background: red;
}

.my-component-page button {
  color: blue;
}
```

### ❌ DON'T: Define `:root` variables in component CSS

```css
/* BAD - Creates conflicts */
:root {
  --my-color: #123456;
}
```

### ✅ DO: Use existing global variables or define component-specific ones

```css
/* GOOD - Component-specific variable */
.my-component-page {
  --component-specific-color: #123456;
}

.my-component-page .element {
  color: var(--component-specific-color);
}
```

### ❌ DON'T: Reset global styles

```css
/* BAD - Affects entire app */
* {
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial;
}
```

### ✅ DO: Style your component wrapper

```css
/* GOOD - Only affects this component */
.my-component-page {
  font-family: Arial;
}
```

## Migrating Existing CSS

If you have an existing CSS file with global selectors:

1. **Add a comment** at the top indicating the scope:
   ```css
   /* MyComponent Styles - All scoped under .my-component-page */
   ```

2. **Remove global definitions**:
   - Remove `:root` blocks (move variables to `index.css` if truly global)
   - Remove `*`, `html`, `body` selectors
   - Remove `.material-symbols-outlined` definitions

3. **Add wrapper prefix** to all selectors:
   ```bash
   # Use regex to prefix selectors
   # Before: .header {
   # After:  .my-component-page .header {
   ```

4. **Update component JSX**:
   - Add wrapper class to root element
   - Ensure dark mode classes work: `className="my-component-page dark"`

## CSS Variable Reference

### Global Variables (available everywhere)

**Brand Colors:**
- `--primary`: #ea2a33
- `--primary-dark`: #c91f27
- `--success`: #07885d

**Light Theme:**
- `--background-light`: #f8f6f6
- `--background-alt`: #f9fafb
- `--text-light`: #181111
- `--text-main`: #111827
- `--text-muted`: #6b7280
- `--text-secondary`: #886364
- `--border-light`: #e5dcdc
- `--bg-light-hover`: #f4f0f0

**Dark Theme:**
- `--background-dark`: #211111
- `--background-dark-alt`: #1f2937
- `--text-dark`: #ffffff
- `--border-dark`: #3d2a2a
- `--bg-dark-hover`: #2d1a1a

## Testing Your CSS

Before committing, verify:

1. ✅ Your component renders correctly
2. ✅ Navigate to another page and back - styles should remain intact
3. ✅ Open DevTools and verify no CSS warnings
4. ✅ Check that other pages aren't affected by your CSS
5. ✅ Test in both light and dark mode (if applicable)

## File Organization

```
src/
├── index.css              # Global styles only
├── css/
│   ├── HomePage.css       # Scoped: .home-page
│   ├── teacher.css        # Scoped: .teacher-page
│   ├── product.css        # Scoped: .product-page
│   ├── auth.css           # Scoped: .auth-page
│   └── ...
└── pages/
    ├── Home.jsx           # Adds .home-page wrapper
    ├── Teacher.jsx        # Adds .teacher-page wrapper
    └── ...
```

## Questions?

If you're unsure whether a style should be global or component-scoped, ask:
- **Will this style be used in 3+ different components?** → Consider global
- **Is this specific to one component/page?** → Keep it scoped
- **When in doubt?** → Scope it to the component

---

**Last Updated**: 2026-01-22
**Maintainer**: Development Team
