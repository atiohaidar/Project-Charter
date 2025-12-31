# Refactoring Plan: Modular Folder Structure

Goal: Separate Form (Notebook Theme) and Document (Typewriter Theme) into distinct folders with dedicated CSS/JS.

## New Structure
```
/Project Charter/
├── index.html          (Form - Notebook)
├── style.css           (Form Styles only)
├── script.js           (Form Logic only)
└── document/
    ├── index.html      (Was document.html - Typewriter)
    ├── style.css       (Typewriter Styles only)
    └── script.js       (Document Loading Logic only)
```

## Steps
1.  **Split CSS**:
    - Extract "Typewriter" styles from `style.css` -> `document/style.css`.
    - Keep "Notebook" styles in `style.css`.
2.  **Split JS**:
    - Extract "Document Logic" (rendering) from `script.js` -> `document/script.js`.
    - Keep "Form Logic" (saving) in `script.js`.
3.  **Move & Update HTML**:
    - Move `document.html` -> `document/index.html`.
    - Update `<link>` and `<script>` paths in `document/index.html` to point to local `style.css` and `script.js`.
    - Update "Generate" button in `index.html` to point to `document/index.html`.
    - Update "Back" button in `document/index.html` to point to `../index.html`.
