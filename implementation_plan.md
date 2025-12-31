# Implementation Plan: Typewriter Theme for Document

The user requested a **Typewriter** aesthetic for the result document, differentiating it from the **Notebook** aesthetic of the form.

## 1. Font Selection
- **Typewriter Font**: `'Special Elite'` or `'Courier Prime'` from Google Fonts.
- **Why**: `Special Elite` simulates the texture of an old typewriter ribbon.

## 2. CSS Architecture Refactor
Currently, `.container` (Form) and `.doc-page` (Document) share the same "Lined Paper" style. We need to split them.

- **Global**: Keep font imports.
- **`.container` (Form)**: Keep Lined Paper background & Handwritten fonts.
- **`.doc-page` (Document)**:
  - **Background**: Plain off-white / aged paper (`#fffdf0` or texture). **No Lines**.
  - **Font**: `Special Elite` for everything.
  - **Headings**: Uppercase, maybe underlined with dashes.
  - **Text**: Dark grey/black (`#2c2c2c`).
  - **Layout**: Standard margins, justified text.

## 3. Action Items
1.  Update `@import` in `style.css` to include `Special Elite`.
2.  Decouple `.container` and `.doc-page` styles.
3.  Apply Typewriter specific styles to `.doc-page`.
