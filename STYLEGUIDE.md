# Study Guide Component Style Guide

This document outlines the reusable HTML structures and corresponding CSS classes for creating study guide sections on **any topic**.

## Base Styles & Layout

*   **Variables:** CSS variables define the core color palette (`--primary`, `--secondary`, `--accent`, `--light`, `--dark`, `--correct`, `--wrong`, `--gold`).
*   **Body:** Basic typography (`font-family: 'Segoe UI', ...`, `line-height: 1.6`) and background color (`--light`).
*   **Container:** `.container` class provides `max-width: 1200px` and centering.
*   **Headings:** `<h1>`, `<h2>`, `<h3>` use `color: var(--primary)` and have `margin-bottom: 15px` by default.
*   **Paragraphs:** `<p>` have `margin-bottom: 15px` by default.
*   **Links:** `<a>` tags are standard browser default unless styled specifically (like in Nav or `.support-list`).
*   **Lists:** Basic `<ul>` have default left padding and bullet style unless specific list classes are used.

## Header & Navigation

*   **Header:** `<header>` element has primary background, white text, padding, rounded corners, and shadow.
*   **Navigation:** `<nav>` element wraps a `<ul>`. Uses flexbox for horizontal layout. `<a>` tags are styled as blocks with hover/active states using primary background. `data-section="[id]"` attribute is used by JS for navigation.

```html
<header>
    <h1>[Study Guide Topic Title]</h1>
    <p>[Optional Subtitle or Description]</p>
</header>
<nav>
    <ul>
        <li><a href="#" class="active" data-section="intro">Introduction</a></li>
        <li><a href="#" data-section="topic-1">[Topic 1 Name]</a></li>
        <li><a href="#" data-section="topic-2">[Topic 2 Name]</a></li>
        <!-- other nav links -->
        <li><a href="#" data-section="quiz">Quiz</a></li>
    </ul>
</nav>
```

## Core Section Structure

Each topic/chapter should be a `<section>` with the classes `section animated` and a unique `id` matching the `data-section` in the nav. The `.active` class controls visibility (handled by JS).

```html
<section id="topic-1" class="section animated">
    <h2>[Section Title e.g., Topic 1 Name]</h2>
    <!-- Subsections go here -->
    <button onclick="document.querySelector('[data-section=\'topic-2\']').click()">Next Section</button>
</section>
```

## Subsections

Content within a `<section>` should be divided into logical `.subsection` divs. Each subsection requires a `.theme-*` class for background color and has default padding and shadow.

**Available Themes:**
*   `.theme-blue`
*   `.theme-lblue` (lighter blue)
*   `.theme-green`
*   `.theme-yellow`
*   `.theme-lyellow` (lighter yellow)
*   `.theme-orange`
*   `.theme-purple`
*   `.theme-pink`
*   `.theme-red`
*   `.theme-cyan`

**Subsection Heading:**
Each subsection should start with an `<h3>`. Use `<span class="box-icon">[emoji]</span>` before the text for a leading icon. The heading has a primary color bottom border by default.

```html
<div class="subsection [theme-class]">
    <h3><span class="box-icon">[emoji]</span> [Subsection Title]</h3>
    <!-- Content components go here -->
</div>
```

## Content Components

### 1. Basic Boxes (`.definition`, `.info-box`, `.warning-box`)

Used for definitions, general info, or warnings. They have distinct background colors and left borders.

*   **Classes:** `definition` (green border), `info-box` (blue background), `warning-box` (red background)
*   **Headings:** Use `<h3>` or `<h4>`. Can include a `.box-icon` span with an appropriate emoji/icon.
*   **Content:** Typically `<p>` and `<ul>` or `<ol>`.

```html
<div class="info-box">
    <h4><span class="box-icon">💡</span> [Box Title]</h4>
    <p>[Information text...]</p>
    <ul>
        <li>[List item 1]</li>
        <li>[List item 2]</li>
    </ul>
</div>

<div class="warning-box">
    <h4><span class="box-icon">⚠️</span> [Warning Title]</h4>
    <p>[Warning text...]</p>
</div>
```

### 1.1 Portrait Box (`.info-box.box-with-bg-icon` + `.portrait-figure`)

A reusable box for profiling individuals (founders, key figures, or any person of interest) in a visually distinct way. The box includes a floated portrait, a caption, a heading, and a short summary. Clicking the portrait opens the Portrait Modal with Biography for deeper exploration.

*   **Classes:** `info-box box-with-bg-icon` (for the box), `portrait-figure` (for the image/caption block)
*   **Attributes:** `data-bg-icon="👤"` or other relevant emoji for the background icon
*   **Structure:**
    *   `<div class="info-box box-with-bg-icon" data-bg-icon="[emoji]">`
        *   `<figure class="portrait-figure">`
            *   `<img src="[portrait-url]" alt="[Name]" class="portrait-img" data-person="[key]" onclick="openPortraitModal(this)">`
            *   `<figcaption>[Name]</figcaption>`
        *   `</figure>`
        *   `<h3>[Name] ([years])</h3>`
        *   `<p>[Condensed summary or intro]</p>`
    *   `</div>`
*   **Usage:**
    *   Use for any individual you want to highlight, not just founders.
    *   The `data-person` attribute on the image must match a key in the modal's biography mapping.
    *   The portrait is floated right, with the text flowing around it.
    *   Clicking the portrait opens the Portrait Modal for a deeper biography and external link.

```html
<div class="info-box box-with-bg-icon" data-bg-icon="👤">
  <figure class="portrait-figure">
    <img src="[portrait-url]" alt="[Name]" class="portrait-img" data-person="[key]" onclick="openPortraitModal(this)">
    <figcaption>[Name]</figcaption>
  </figure>
  <h3>[Name] ([years])</h3>
  <p>[Condensed summary or intro]</p>
</div>
```

*See the ideologies guide for a full implementation example and how this links to the Portrait Modal with Biography.*

### 2. Box with Background Icon (`.box-with-bg-icon`)

Enhances a Basic Box by adding a large, subtle background icon (via `::before`). **Do not** use `.box-icon` in the heading of these.

*   **Classes:** Base box class (`definition`, `info-box`, `warning-box`) + `box-with-bg-icon`.
*   **Attribute:** `data-bg-icon="[emoji]"` (Required, sets the icon content for `::before`).
*   **Heading:** `<h3>` or `<h4>` **without** `.box-icon`.
*   **Content:** `<p>`, `<ul>`, etc.
*   **Styling:** Uses `float: right` for the icon's pseudo-element, ensuring text wraps around it. `overflow: hidden` contains the float. `box-sizing: border-box` is applied.

```html
<div class="info-box box-with-bg-icon" data-bg-icon="⚙️"> <!-- Example using generic gear -->
    <h3>[Box Title - No Leading Icon]</h3>
    <p>[Content text that might wrap around the floated background icon.]</p>
    <ul>
        <li>[List item 1]</li>
    </ul>
</div>
```

### 3. Icon List (`.icon-list-alt`)

Used for lists where each item has a leading icon.

*   **Classes:** `<ul>` with class `icon-list-alt`. Can add `.cols-2` for a two-column layout on wider screens.
*   **List Items:** `<li>` containing `<span class="list-icon">[emoji]</span>` followed by the text (often wrapped in `<strong>`). Uses flexbox for alignment.

```html
<ul class="icon-list-alt cols-2">
    <li><span class="list-icon">✔️</span> <strong>[Item 1]:</strong> [Description...]</li>
    <li><span class="list-icon">➡️</span> <strong>[Item 2]:</strong> [Description...]</li>
    <li><span class="list-icon">[emoji]</span> <strong>[Item 3]:</strong> [Description...]</li>
</ul>
```

### 4. Styled List (`.styled-list`)

Used for general styled lists. Uses `::before` pseudo-elements for bullets.

*   **Classes:** `<ul>` with class `styled-list`.
*   **Modifiers:**
    *   `.check-list-alt`: Check marks (default green).
    *   `.check-list-alt.green-checks`: Green checks.
    *   `.check-list-alt.red-checks`: Red checks.
    *   `.cross-list-alt`: Cross marks.
*   **List Items:** `<li>` containing text.

```html
<ul class="styled-list check-list-alt green-checks">
    <li>[Positive point 1]</li>
    <li>[Positive point 2]</li>
</ul>

<ul class="styled-list cross-list-alt">
    <li>[Negative point 1]</li>
</ul>
```

### 4.1 Support List (`.support-list`)

A specialized list potentially used within info boxes for contacts or resources. Uses icons based on content.

*   **Classes:** `<ul>` with class `support-list`. Typically placed inside an `.info-box.support-box`.
*   **List Items:** `<li>` containing text. Uses `::before` for icon.
*   **Icon Logic:** Defaults to 📞. If the `<li>` contains an `<a>` tag, the icon becomes 🌐.

```html
<div class="info-box support-box">
    <h4><span class="box-icon">🆘</span> [Resource List Title]</h4>
    <ul class="support-list">
        <li><strong>[Resource Name]:</strong> [Description] <a href="...">[Link Text]</a></li>
        <li><strong>[Contact Name]:</strong> [Phone Number]</li>
    </ul>
</div>
```

### 5. Icon Card Deck (`.icon-card-deck`)

A flex container (`.flex-container`) for displaying multiple cards, often used for benefits, risks, factors, examples, etc.

*   **Container Classes:** `<div class="flex-container icon-card-deck [theme-modifier]">`
    *   **Theme Modifiers:** `.theme-lifestyle` (primary border), `.theme-benefit` (secondary/green border), `.theme-risk` (accent/red border). Use the modifier that best fits the card content's theme.
*   **Card Classes:** `<div class="card">` (Base card styles: padding, shadow, hover effect, `flex: 1 1 300px`).
*   **Card Heading:** `<h4><span class="box-icon">[emoji]</span> [Card Title]</h4>` (Icon appears above text using `display: block`).
*   **Card Content:** `<p>`, `<ul>` (unstyled list by default within card, `padding-left: 0`).

```html
<div class="flex-container icon-card-deck theme-benefit">
    <div class="card">
        <h4><span class="box-icon">👍</span> [Benefit/Factor 1 Title]</h4>
        <p>[Description...]</p>
    </div>
    <div class="card">
        <h4><span class="box-icon">🎉</span> [Benefit/Factor 2 Title]</h4>
        <ul><li>[Point A]</li><li>[Point B]</li></ul>
    </div>
    <!-- more cards -->
</div>
```

### 6. Card with Background Icon (`.icon-bg-card`)

Used *within* an `.icon-card-deck` for cards that also need a large, subtle background icon (e.g., representing Lifestyle Factors in the health guide).

*   **Classes:** `<div class="card icon-bg-card">`
*   **Attribute:** `data-bg-icon="[emoji]"` (Required)
*   **Heading/Content:** Same as standard card. Uses `::before` for the background icon.

```html
<div class="flex-container icon-card-deck theme-lifestyle">
    <div class="card icon-bg-card" data-bg-icon="[emoji]">
        <h4><span class="box-icon">[emoji]</span> [Card Title]</h4> 
        <p>[Description...]</p>
    </div>
    <!-- more cards -->
</div>
```

### 7. Two-Column Layout (`.flex-two-column`)

Simple two-column flex layout, useful for side-by-side text, or text and an illustration.

*   **Container Class:** `<div class="flex-two-column">`
*   **Column Class:** `<div class="column">` (Styles set `flex: 1 1 45%`).

```html
<div class="flex-two-column">
    <div class="column">
        <!-- Left column content (e.g., text) -->
    </div>
    <div class="column">
        <!-- Right column content (e.g., illustration or more text) -->
    </div>
</div>
```

### 8. Comparison Grid (`.comparison-grid`)

Used for side-by-side comparisons (e.g., Then vs. Now, Pro vs. Con). Uses CSS Grid.

*   **Container Class:** `<div class="comparison-grid">` (often within an `.info-box`)
*   **Item Class:** `<div class="comparison-item">`

```html
<div class="info-box comparison-box">
    <h3>[Comparison Title]</h3>
    <div class="comparison-grid">
        <div class="comparison-item">
            <h4>[CATEGORY 1] <span class="icon">[emoji]</span></h4>
            <p>[Content for Category 1]</p>
        </div>
        <div class="comparison-item">
            <h4>[CATEGORY 2] <span class="icon">[emoji]</span></h4>
            <p>[Content for Category 2]</p>
        </div>
    </div>
</div>
```

### 9. Buttons (`<button>`)

Standard button styling with primary background, white text, rounded corners, padding, and hover effect (lifts slightly). Also used for section navigation.

```html
<button>Click Me</button>
<button onclick="...">Next Section</button>
```

### 10. Illustrations (`.illustration`)

A simple container for images or SVGs with a light grey background and padding. Note: Complex SVGs might require custom inline or CSS styling beyond this container.

```html
<div class="illustration">
    <svg>...</svg> 
    <!-- or -->
    <img src="..." alt="[Descriptive Alt Text]">
</div>
```

### 11. Achievements (`.achievements`, `.achievement`, `.unlocked`)

Used to display unlockable achievements.

*   **Container:** `<div id="achievements-list" class="achievements">` (Uses flexbox).
*   **Item:** `<div class="achievement" id="[ach-id]" data-name="[ach-name]">`
    *   Contains `.achievement-icon`, `<h3>`, `<p>`, and `.locked-overlay`.
    *   `.unlocked` class is added via JS when achieved (hides overlay, changes appearance).
    *   Secret achievements (`secret: true` in JS data) are not rendered initially but added by `loadAchievements` if unlocked.

```html
<div id="achievements-list" class="achievements">
    <div class="achievement" id="example-ach" data-name="Example Achievement">
        <div class="achievement-icon">🏆</div>
        <h3>[Achievement Name]</h3>
        <p>[Achievement Description]</p>
        <div class="locked-overlay">🔒</div>
    </div>
    <!-- more achievements -->
</div>
```
*(Achievement data defined in `studyguide-core.js`, rendering handled by `renderAchievements`, unlocking by `unlockAchievement`, state by `loadAchievements`)*

### 12. Achievement Popups (`.achievement-popup`)

Dynamically created notification for single or multiple achievements/records.

*   **Class:** `.achievement-popup` (Styles the golden plaque appearance, includes fade/scale animations via `.show` class).
*   **Structure (Single):** Contains `.icon`, `<h3>`, `<p>`.
*   **Structure (Multiple):** Contains `<h3>`, `.multi-achievement-list` (with icons and text), optional `hr.popup-divider`, optional `.new-record-section` with `<h4>` and `<p>`. 

*(Generated by JavaScript: `showAchievementNotification` / `showBatchedAchievementNotifications` in `studyguide-core.js`)*

### 13. Quiz UI Components

Various elements used within the `#quiz` section, mostly managed by `interactive-quiz.js`.

*   **Start Screen:** `#quiz-start` container.
*   **Difficulty Switch:** `.difficulty-switch` with radio buttons and styled labels (`.switch-container`, `.switch-label`, `.switch-selection`).
*   **Progress Display:** `#quiz-progress` container (shown during quiz). Includes `.timer` (`#quiz-timer`) and `.progress-container` with `.progress-bar` (`#quiz-progress-bar`). Also `#quiz-progress-text`.
*   **Floating Status:** `#quiz-status-floating` (fixed position overlay shown during quiz). Includes `.timer` (`#floating-timer`), `.mini-progress` with `.mini-progress-bar` (`#floating-progress-bar`), and `.status-text` (`#floating-status`).
*   **Questions:** `#quiz-questions` container. Each question is in a `.question` div, containing `.options` div with multiple clickable `.option` divs. Option states: default, `:hover`, `.selected`, `.correct` (shown on results), `.wrong` (shown on results).
*   **Results:** `#quiz-result` container. Includes score (`.quiz-score`), action buttons (`#show-answers-btn`, `#restart-quiz-btn`). Can have `.max-score-celebration`