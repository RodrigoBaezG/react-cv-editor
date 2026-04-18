# Code Review — mi-cv-editor

> Review Date: April 2026  
> Reviewer: Claude Sonnet 4.6  
> Stack: React 19 · Vite 7 · Tailwind CSS 4 · html2pdf.js · useReducer + Context

---

## Executive Summary

The project is a clean, well-structured React CV editor with solid fundamentals: proper use of Context + useReducer for state, reusable form components, and a live preview with PDF export. The code is readable and intentional.

The main gaps are: **no persistence** (data disappears on refresh), **no test layer**, several **UX friction points**, a few **real bugs**, and a template design that can be significantly upgraded without adding complexity.

---

## Improvements by Priority

---

### P0 — Bugs (Fix immediately)

---

#### BUG-01 · SkillsForm dispatches to the wrong reducer key

**File:** `src/editor/forms/SkillsForm.jsx:10`  
**File:** `src/context/CvContext.jsx:initialState`

`habilidades` lives at the **root** of the state (`state.habilidades`), but `UPDATE_PERSONAL_FIELD` writes to `state.personal[key]`. The dispatch in SkillsForm uses that same action, so `state.personal.habilidades` gets set while `state.habilidades` (read by Template1) is never updated — the preview never reflects skills edits.

**Current code (SkillsForm.jsx):**
```jsx
dispatch({
    type: 'UPDATE_PERSONAL_FIELD',
    payload: { key: 'habilidades', value: e.target.value },
});
```

**Fix — add a dedicated action in the reducer:**
```js
// CvContext.jsx — cvReducer
case 'UPDATE_SKILLS':
    return { ...state, habilidades: action.payload };
```

```jsx
// SkillsForm.jsx
dispatch({ type: 'UPDATE_SKILLS', payload: e.target.value });
```

---

#### BUG-02 · ExperienceItem edit mode does not sync when parent item changes

**File:** `src/editor/forms/ExperienceItem.jsx:6`

`formData` is initialized from `item` once, at mount. If another action updates the same item externally (e.g. undo, future import), the local edit state is stale.

**Fix:**
```jsx
// Sync formData whenever the item prop changes
useEffect(() => {
    setFormData(item);
}, [item]);
```

Same applies to `EducationItem.jsx`.

---

#### BUG-03 · `window.confirm` breaks in test environments and SSR

**Files:** `ExperienceItem.jsx:37`, `EducationItem.jsx:37`

`window.confirm` is not reliable in automated tests and blocks the event loop. Replace with an inline confirmation UI (a small "Are you sure?" toggle within the item card). This also looks more professional.

---

#### BUG-04 · `App.css` is imported nowhere but contains overriding rules

**File:** `src/App.css`

`App.css` (the Vite default stub) is **not imported** in `App.jsx` or `main.jsx` in the current codebase. It contains `#root { max-width: 1280px; text-align: center; }` which, if accidentally re-added, would break the layout. Delete the file.

---

#### BUG-05 · `index.css` double Tailwind import

**File:** `src/index.css`

```css
@import "tailwindcss";    /* ← imports base + components + utilities */
@reference "tailwindcss"; /* ← only needed when NOT importing above */
@tailwind utilities;      /* ← duplicates utilities */
```

With Tailwind v4 via the Vite plugin, the correct minimal content is:

```css
@import "tailwindcss";
```

Remove the `@reference` line and the `@tailwind utilities` directive.

---

### P1 — Data Persistence (High user impact, one file)

---

#### PERSIST-01 · State is lost on every page refresh

There is no localStorage persistence. A user who spends 20 minutes editing their CV will lose all work on accidental refresh.

**Fix — add a localStorage middleware in CvContext.jsx:**

```jsx
// CvContext.jsx

const STORAGE_KEY = 'mi-cv-editor-state';

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initialState;
    } catch {
        return initialState;
    }
}

export const CvProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cvReducer, undefined, loadState);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // storage quota exceeded — fail silently
        }
    }, [state]);

    return (
        <CvContext.Provider value={{ state, dispatch }}>
            {children}
        </CvContext.Provider>
    );
};
```

Add a "Reset to defaults" button in the Editor header that dispatches a `RESET` action and clears localStorage.

---

### P2 — Security

---

#### SEC-01 · XSS via innerHTML in html2pdf.js (low risk, worth noting)

**File:** `src/editor/Editor.jsx:7`

`html2pdf` serializes the live DOM of `#cv-preview-template`. All user input flows through React's JSX rendering, which escapes HTML by default — so there is no direct injection vector. **However**, if a future enhancement adds `dangerouslySetInnerHTML` or an `<iframe>` preview, this surface area grows. Keep React's default escaping in place; never render raw user strings with `dangerouslySetInnerHTML`.

---

#### SEC-02 · Missing `rel="noopener noreferrer"` if LinkedIn link becomes an anchor

**File:** `src/preview/templates/Template1.jsx`

The LinkedIn value is currently rendered as plain text. If it is ever turned into a clickable `<a href>` link (very likely for a CV template), ensure it includes `target="_blank" rel="noopener noreferrer"` to prevent tab-napping.

---

#### SEC-03 · `console.log` / `logging: true` in production PDF export

**File:** `src/editor/Editor.jsx:17`

```js
html2canvas: { scale: 2, logging: true, ... }
```

`logging: true` dumps verbose canvas logs to the browser console in production. Set it to `false` or conditionally to `import.meta.env.DEV`.

---

### P3 — Code Simplification

---

#### SIMP-01 · ExperienceItem and EducationItem are 95% identical — extract a generic `ListItem`

Both item components share the same shape: view mode with two action buttons, edit mode with a form. The only differences are field names and the section key passed to dispatch.

**Proposed API:**
```jsx
// src/editor/forms/ListItem.jsx
function ListItem({ item, section, renderView, renderEditFields }) { ... }
```

This cuts ~120 lines of duplicated logic.

---

#### SIMP-02 · ExperienceForm and EducationForm differ only in field set — extract a generic `ListForm`

Same pattern as items. A `ListForm` accepting `section`, `fields`, and `initialValues` props would eliminate the duplication.

> **Note:** Only do SIMP-01 and SIMP-02 together — doing one without the other just moves the duplication.

---

#### SIMP-03 · `tailwind.config.js` contains dead config for Tailwind v4

**File:** `tailwind.config.js`

The `future` and `experimental` blocks are Tailwind v3 options. With Tailwind v4 (used here via `@tailwindcss/vite`), configuration is done in CSS, not in `tailwind.config.js`. The file can be reduced to:

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: { extend: {} },
    plugins: [],
}
```

---

#### SIMP-04 · `Button` className merging is fragile

**File:** `src/components/Button.jsx:24`

```jsx
className={`${baseStyle} ${variantStyle} ${className}`}
```

External `className` can conflict with variant styles (e.g. padding overrides). Use a utility like `clsx` or a simple conditional join:

```jsx
import clsx from 'clsx'; // add: npm i clsx

<button className={clsx(baseStyle, variantStyle, className)} ...>
```

---

#### SIMP-05 · `useContext(CvContext)` is called in 7 components — extract a custom hook

Centralizing prevents the context shape from leaking into every consumer:

```jsx
// src/context/useCv.js
import { useContext } from 'react';
import { CvContext } from './CvContext';

export function useCv() {
    const ctx = useContext(CvContext);
    if (!ctx) throw new Error('useCv must be used within CvProvider');
    return ctx;
}
```

Then replace `useContext(CvContext)` everywhere with `useCv()`.

---

### P4 — UI & Aesthetics

---

#### UI-01 · Template1 is monochrome blue — add visual hierarchy to the CV preview

**File:** `src/preview/templates/Template1.jsx`

Every element uses the same `text-[#1D4ED8]` color. A real CV needs visual hierarchy: a dark header, lighter body text, and accent colors used sparingly.

**Suggested palette:**
```
Header background: #1D4ED8 (blue)  → white text on it
Body text: #1F2937 (near-black)
Section titles: #1D4ED8 with bottom border
Dates/subtitles: #6B7280 (gray-500)
Contact row: #374151 (gray-700)
```

**Structural change — add a colored header band:**
```jsx
<header className="bg-[#1D4ED8] text-white px-8 py-6 -mx-8 -mt-8 mb-6">
    <h1 className="text-4xl font-black uppercase tracking-wide">{personal.nombre}</h1>
    <h2 className="text-base font-medium opacity-90 mt-1">{personal.titulo}</h2>
    <div className="flex gap-4 text-xs mt-3 opacity-80 flex-wrap">
        <span>✉ {personal.email}</span>
        <span>✆ {personal.telefono}</span>
        <span>🔗 {personal.linkedin}</span>
    </div>
</header>
```

---

#### UI-02 · Editor header uses an emoji — replace with a proper icon

**File:** `src/editor/Editor.jsx:23`

```jsx
<h2 className="text-3xl font-bold text-blue-800">✏️ Cv editor</h2>
```

- Title case is inconsistent: "Cv" should be "CV"
- The pencil emoji renders differently across OS/browsers
- Use `FaPencilAlt` from react-icons (already a dependency)

```jsx
import { FaDownload, FaPencilAlt } from 'react-icons/fa';

<h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
    <FaPencilAlt className="text-blue-600" />
    CV Editor
</h2>
```

---

#### UI-03 · Preview.jsx emoji in heading

**File:** `src/preview/Preview.jsx:7`

Same issue: `📄 Preview` — replace with `FaFileAlt` icon.

---

#### UI-04 · Footer note is in Spanish and informal

**File:** `src/editor/Editor.jsx:45`

```jsx
<p>¡The project is complete! Your portfolio now has a functional tool.</p>
```

This is a dev note from the tutorial phase — remove it or replace with a meaningful app tagline like "Changes are saved automatically."

---

#### UI-05 · Add a visible "autosave" indicator

Once PERSIST-01 is implemented, show a small status indicator near the top of the editor:

```jsx
// Debounced "Saved" indicator
<span className="text-xs text-green-600 flex items-center gap-1">
    <FaCheck /> Saved
</span>
```

---

#### UI-06 · Mobile: Preview is visible but unusable at small screen sizes

**File:** `src/layout/AppLayout.jsx`

On mobile, both editor and preview stack vertically. The preview (`min-h-[842px]`) forces the user to scroll far. Add a tab switcher on mobile:

```jsx
// Mobile: toggle between "Edit" and "Preview" tabs
// Desktop: two-column layout as today
```

This is a significant UX improvement for mobile users.

---

#### UI-07 · Section headers lack consistent visual weight

The editor section titles (`Personal Information`, `Work Experience`, etc.) all use the same `text-xl font-semibold border-b` style, which is good for consistency. Consider adding a colored left-border accent to make sections more scannable:

```jsx
<h3 className="text-xl font-semibold border-b pb-2 text-gray-700 pl-3 border-l-4 border-l-blue-500">
```

---

### P5 — Testing

---

#### TEST SETUP

No test framework is configured. Add Vitest + React Testing Library:

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D @playwright/test
```

**vite.config.js — add test config:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.js',
    },
})
```

**src/test/setup.js:**
```js
import '@testing-library/jest-dom';
```

**package.json scripts:**
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:e2e": "playwright test"
```

---

#### TEST-01 · Unit test: cvReducer

**File to create:** `src/context/cvReducer.test.js`

```js
import { describe, it, expect } from 'vitest';
import { cvReducer, initialState } from './CvContext';

describe('cvReducer', () => {
    it('UPDATE_PERSONAL_FIELD updates a personal field', () => {
        const action = {
            type: 'UPDATE_PERSONAL_FIELD',
            payload: { key: 'nombre', value: 'John Doe' },
        };
        const next = cvReducer(initialState, action);
        expect(next.personal.nombre).toBe('John Doe');
        // does not mutate other fields
        expect(next.personal.email).toBe(initialState.personal.email);
    });

    it('ADD_ITEM adds to the correct section', () => {
        const action = {
            type: 'ADD_ITEM',
            payload: { section: 'experiencia', data: { puesto: 'Dev', empresa: 'ACME', fechas: '2024', descripcion: '' } },
        };
        const next = cvReducer(initialState, action);
        expect(next.experiencia).toHaveLength(initialState.experiencia.length + 1);
        expect(next.experiencia.at(-1).puesto).toBe('Dev');
        expect(next.experiencia.at(-1).id).toBeDefined();
    });

    it('EDIT_ITEM updates only the matching item', () => {
        const targetId = initialState.experiencia[0].id;
        const action = {
            type: 'EDIT_ITEM',
            payload: { section: 'experiencia', id: targetId, data: { puesto: 'Updated' } },
        };
        const next = cvReducer(initialState, action);
        expect(next.experiencia[0].puesto).toBe('Updated');
    });

    it('DELETE_ITEM removes the item by id', () => {
        const targetId = initialState.experiencia[0].id;
        const action = {
            type: 'DELETE_ITEM',
            payload: { section: 'experiencia', id: targetId },
        };
        const next = cvReducer(initialState, action);
        expect(next.experiencia).toHaveLength(initialState.experiencia.length - 1);
        expect(next.experiencia.find(i => i.id === targetId)).toBeUndefined();
    });

    it('UPDATE_SKILLS updates root habilidades (after BUG-01 fix)', () => {
        const action = { type: 'UPDATE_SKILLS', payload: 'React, TypeScript' };
        const next = cvReducer(initialState, action);
        expect(next.habilidades).toBe('React, TypeScript');
        // must NOT write to personal
        expect(next.personal.habilidades).toBeUndefined();
    });

    it('unknown action returns state unchanged', () => {
        const next = cvReducer(initialState, { type: 'UNKNOWN' });
        expect(next).toBe(initialState);
    });
});
```

---

#### TEST-02 · Unit test: Button component

**File to create:** `src/components/Button.test.jsx`

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Save</Button>);
        await userEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('applies primary variant classes by default', () => {
        render(<Button>Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
    });

    it('applies danger variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });

    it('applies secondary variant classes', () => {
        render(<Button variant="secondary">Cancel</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
    });

    it('defaults to type="button" to avoid accidental form submission', () => {
        render(<Button>No submit</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
});
```

---

#### TEST-03 · Unit test: PersonalForm integration with context

**File to create:** `src/editor/forms/PersonalForm.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CvProvider } from '../../context/CvContext';
import PersonalForm from './PersonalForm';

function renderWithContext(ui) {
    return render(<CvProvider>{ui}</CvProvider>);
}

describe('PersonalForm', () => {
    it('renders all personal fields', () => {
        renderWithContext(<PersonalForm />);
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/professional summary/i)).toBeInTheDocument();
    });

    it('dispatches UPDATE_PERSONAL_FIELD when name field changes', async () => {
        renderWithContext(<PersonalForm />);
        const nameInput = screen.getByLabelText(/full name/i);
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Jane Smith');
        expect(nameInput).toHaveValue('Jane Smith');
    });
});
```

---

#### TEST-04 · Unit test: ExperienceForm — add and display items

**File to create:** `src/editor/forms/ExperienceForm.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CvProvider } from '../../context/CvContext';
import ExperienceForm from './ExperienceForm';

function renderWithContext(ui) {
    return render(<CvProvider>{ui}</CvProvider>);
}

describe('ExperienceForm', () => {
    it('renders section heading', () => {
        renderWithContext(<ExperienceForm />);
        expect(screen.getByText(/work experience/i)).toBeInTheDocument();
    });

    it('shows add button', () => {
        renderWithContext(<ExperienceForm />);
        expect(screen.getByRole('button', { name: /add experience/i })).toBeInTheDocument();
    });

    it('does not add item when required fields are empty', async () => {
        renderWithContext(<ExperienceForm />);
        const initialItems = screen.queryAllByRole('button', { name: /edit/i }).length;
        await userEvent.click(screen.getByRole('button', { name: /add experience/i }));
        expect(screen.queryAllByRole('button', { name: /edit/i })).toHaveLength(initialItems);
    });

    it('adds a new item when position and company are filled', async () => {
        renderWithContext(<ExperienceForm />);
        await userEvent.type(screen.getByLabelText(/position/i), 'Frontend Dev');
        await userEvent.type(screen.getByLabelText(/company/i), 'ACME Corp');
        await userEvent.click(screen.getByRole('button', { name: /add experience/i }));
        expect(screen.getByText(/Frontend Dev at ACME Corp/i)).toBeInTheDocument();
    });

    it('clears the form after adding an item', async () => {
        renderWithContext(<ExperienceForm />);
        const positionInput = screen.getByLabelText(/position/i);
        await userEvent.type(positionInput, 'Dev');
        await userEvent.type(screen.getByLabelText(/company/i), 'Co');
        await userEvent.click(screen.getByRole('button', { name: /add experience/i }));
        expect(positionInput).toHaveValue('');
    });
});
```

---

#### TEST-05 · Unit test: Template1 preview renders state values

**File to create:** `src/preview/templates/Template1.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CvContext } from '../../context/CvContext';
import Template1 from './Template1';

const mockState = {
    personal: {
        nombre: 'Test User',
        titulo: 'Engineer',
        email: 'test@test.com',
        telefono: '123',
        linkedin: 'linkedin.com/in/test',
        resumen: 'Summary text',
    },
    experiencia: [{ id: 1, puesto: 'Dev', empresa: 'Corp', fechas: '2023', descripcion: 'Built stuff' }],
    educacion: [{ id: 2, titulo: 'BSc', institucion: 'Uni', fechas: '2020' }],
    habilidades: 'React, TS',
};

function renderWithMock(ui) {
    return render(
        <CvContext.Provider value={{ state: mockState, dispatch: () => {} }}>
            {ui}
        </CvContext.Provider>
    );
}

describe('Template1', () => {
    it('renders the full name', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText('TEST USER')).toBeInTheDocument(); // uppercase
    });

    it('renders experience entry', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText(/Dev at Corp/i)).toBeInTheDocument();
    });

    it('renders education entry', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText(/BSc/i)).toBeInTheDocument();
    });

    it('renders skills', () => {
        renderWithMock(<Template1 />);
        expect(screen.getByText('React, TS')).toBeInTheDocument();
    });

    it('has the id required for PDF export', () => {
        renderWithMock(<Template1 />);
        expect(document.getElementById('cv-preview-template')).not.toBeNull();
    });
});
```

---

#### TEST-06 · E2E tests with Playwright

**File to create:** `e2e/cv-editor.spec.js`

```js
// e2e/cv-editor.spec.js
import { test, expect } from '@playwright/test';

test.describe('CV Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('page loads with editor and preview', async ({ page }) => {
        await expect(page.getByText('CV Editor')).toBeVisible();
        await expect(page.getByText('Preview')).toBeVisible();
    });

    test('editing the name updates the preview in real time', async ({ page }) => {
        const nameInput = page.getByLabel('Full Name');
        await nameInput.fill('Maria Garcia');
        // Preview renders name in uppercase
        await expect(page.locator('#cv-preview-template')).toContainText('MARIA GARCIA');
    });

    test('editing the job title updates the preview', async ({ page }) => {
        await page.getByLabel('Job Title').fill('Senior Developer');
        await expect(page.locator('#cv-preview-template')).toContainText('Senior Developer');
    });

    test('adding a new experience item appears in preview', async ({ page }) => {
        await page.getByLabel('Position').fill('Lead Dev');
        await page.getByLabel('Company').fill('TechCorp');
        await page.getByRole('button', { name: /add experience/i }).click();
        await expect(page.locator('#cv-preview-template')).toContainText('Lead Dev at TechCorp');
    });

    test('deleting an experience item removes it from preview', async ({ page }) => {
        // The initial state has 'Portfolio Project: CV Editor'
        const previewText = 'Portfolio Project: CV Editor';
        await expect(page.locator('#cv-preview-template')).toContainText(previewText);

        // Click the delete button on the first experience item
        await page.getByRole('button', { name: /delete/i }).first().click();

        // After BUG-03 fix: inline confirm — click "Confirm" instead of window.confirm
        // For now (window.confirm): accept the dialog
        page.on('dialog', dialog => dialog.accept());

        await expect(page.locator('#cv-preview-template')).not.toContainText(previewText);
    });

    test('adding education item appears in preview', async ({ page }) => {
        await page.getByLabel(/title/i).last().fill('MSc AI');
        await page.getByLabel(/institution/i).last().fill('Tech University');
        await page.getByRole('button', { name: /add formation/i }).click();
        await expect(page.locator('#cv-preview-template')).toContainText('MSc AI');
    });

    test('export to PDF button is present and clickable', async ({ page }) => {
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: /export to pdf/i }).click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('.pdf');
    });

    test('state persists after page reload (after PERSIST-01 fix)', async ({ page }) => {
        await page.getByLabel('Full Name').fill('Persistent User');
        await page.reload();
        const nameInput = page.getByLabel('Full Name');
        await expect(nameInput).toHaveValue('Persistent User');
    });
});
```

**Playwright config — create `playwright.config.js`:**
```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    },
});
```

---

## Complete Fix Checklist (ordered by priority)

| # | ID | Category | Effort | Impact |
|---|---|---|---|---|
| 1 | BUG-01 | Bug | 10 min | Skills never update in preview |
| 2 | BUG-05 | Bug | 2 min | Duplicate CSS directives |
| 3 | BUG-04 | Bug | 2 min | Delete orphan App.css |
| 4 | PERSIST-01 | Feature | 30 min | Data survives refresh |
| 5 | BUG-02 | Bug | 10 min | Stale edit state in items |
| 6 | BUG-03 | Bug/UX | 20 min | Replace window.confirm |
| 7 | SEC-03 | Security | 2 min | Disable html2canvas logging |
| 8 | UI-02, UI-03 | UI | 10 min | Replace emojis with icons |
| 9 | UI-04 | UI | 2 min | Remove dev comment |
| 10 | UI-01 | UI | 45 min | Visual hierarchy in Template1 |
| 11 | UI-07 | UI | 10 min | Section header accents |
| 12 | SIMP-05 | Simplification | 15 min | `useCv` custom hook |
| 13 | SIMP-03 | Simplification | 5 min | Clean tailwind.config.js |
| 14 | SIMP-04 | Simplification | 5 min | Add clsx |
| 15 | TEST setup | Testing | 30 min | Install Vitest + Playwright |
| 16 | TEST-01 | Testing | 30 min | Reducer unit tests |
| 17 | TEST-02 | Testing | 20 min | Button unit tests |
| 18 | TEST-03 | Testing | 20 min | PersonalForm tests |
| 19 | TEST-04 | Testing | 30 min | ExperienceForm tests |
| 20 | TEST-05 | Testing | 20 min | Template1 tests |
| 21 | TEST-06 | Testing | 45 min | E2E Playwright suite |
| 22 | UI-06 | UI | 60 min | Mobile tab switcher |
| 23 | SIMP-01+02 | Simplification | 90 min | Generic ListItem + ListForm |

---

## What is already good

- Context + useReducer architecture is well-suited for this complexity level — don't over-engineer it with Redux or Zustand.
- `InputField` and `TextareaField` are properly controlled components with `value || ''` fallback.
- `Button` variant system is clean and composable.
- The two-column sticky layout (`lg:sticky lg:top-8`) is an excellent pattern for a live editor.
- IDs are generated with `Date.now()` — fine for a single-user local app; would need UUIDs only in a multi-user context.
- ESLint is configured with react-hooks rules, which catches the most common React bugs early.
