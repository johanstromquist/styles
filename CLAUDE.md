# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a living workspace for creating interactive study guides for a high school student. As new topics arrive from school, Claude helps transform raw educational material (PDFs, text, images) into engaging, interactive study experiences with quizzes and games.

The existing guides serve as blueprints - they demonstrate patterns and components that work well. The goal is rapid iteration: quickly spin up new guides that make studying more immersive and enjoyable.

## Typical Workflow

1. **New material arrives** → placed in `/subject` folder (PDFs, text files, images from teacher)
2. **Convert if needed** → run `python pdf_to_md.py` to extract text from PDFs
3. **Create the guide** → follow GENERATE.md instructions using STYLEGUIDE.md components
4. **Student studies** → interactive sections, practice questions, timed quizzes, achievements

## Running Locally

```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

## Deployment

Published as a static GitHub Pages site. Just push to main - no build step required.

## Creating a New Study Guide

See GENERATE.md for full instructions. Quick reference:

1. Create folder: `studyguides/[topicId]/`
2. Create `[topicId]guide.html` - use `ideologiesguide.html` as the most complete reference
3. Create `[topicId]quiz.js` with 30+ questions in the `window.questionsDB` format
4. Add entry to `index.html`
5. Use unique guide ID (check index.html for existing ones)

### Question Database Format

```javascript
window.questionsDB = {
    sectionName: [
        {
            question: "...",
            options: ["A", "B", "C", "D"],
            correctIndex: 1,
            difficulty: "normal" // "hard" or "crazy" for bonus challenge
        }
    ]
}
```

## Key Files

| File | Purpose |
|------|---------|
| `STYLEGUIDE.md` | All reusable components (boxes, cards, timelines, modals) |
| `GENERATE.md` | Step-by-step guide creation instructions |
| `studyguide.css` | Shared styles and theme classes |
| `studyguide-core.js` | Achievement system, navigation |
| `interactive-quiz.js` | Quiz engine with timer and scoring |

## Conventions

- All content in Swedish
- Theme classes for visual variety: `.theme-blue`, `.theme-green`, `.theme-yellow`, etc.
- Sections use `data-section` attributes for navigation
- Each guide gets isolated localStorage state via its unique ID
- Only modify new guide files and index.html - core files are stable
