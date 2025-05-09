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
*   **Results:** `#quiz-result` container. Includes score (`.quiz-score`), action buttons (`#show-answers-btn`, `#restart-quiz-btn`). Can have `.max-score-celebration` class added.
*   **Answer Feedback:** `#quiz-answers` container (dynamically created when showing answers).

*(HTML largely generated/managed by `interactive-quiz.js`)*

### 14. Best Score Display (Intro)

Located on the Intro page to show the user's best recorded score.

*   **Container:** `.best-score-display`
*   **Elements:** Contains paragraphs with icons and `<strong>` tags with specific IDs: `#best-score-correct`, `#best-score-time`, `#best-score-points`.

```html
<div class="best-score-display">
    <p><span class="icon">✔️</span> Rätt svar: <strong id="best-score-correct">--</strong></p>
    <p><span class="icon">⏱️</span> Tid: <strong id="best-score-time">--:--</strong></p>
    <p><span class="icon">⭐</span> Poäng: <strong id="best-score-points">----</strong></p>
</div>
```
*(Populated by JavaScript: `updateProgressDisplay` in `studyguide-core.js`)*

### 15. Vertical Timeline (`.timeline`)

Used to display chronological sequences of events.

*   **Container:** `<div class="timeline">`
*   **Event Wrapper:** `<div class="timeline-event [left/right]">` - Use `left` for the first event, `right` for the second, alternating down the timeline. Holds the content and the connector bubble/arrow.
*   **Event Content:** `<div class="timeline-content">` - Contains the actual event information.
    *   **Date/Year:** `<span class="timeline-date">[Date/Year]</span>` (Optional, styled distinctly)
    *   **Title:** `<h4>[Event Title]</h4>`
    *   **Description:** `<p>[Event Description]</p>`
*   **Styling:** Features a central vertical line, alternating content boxes with connecting arrows and circles. Includes fade-in animation for events. Responsive design collapses to single-sided on smaller screens.

```html
<div class="timeline">
    <div class="timeline-event left">
        <div class="timeline-content">
            <span class="timeline-date">[Year/Date 1]</span>
            <h4>[Event Title 1]</h4>
            <p>[Description of event 1...]</p>
        </div>
    </div>
    <div class="timeline-event right">
        <div class="timeline-content">
            <span class="timeline-date">[Year/Date 2]</span>
            <h4>[Event Title 2]</h4>
            <p>[Description of event 2...]</p>
        </div>
    </div>
    <div class="timeline-event left">
        <div class="timeline-content">
            <span class="timeline-date">[Year/Date 3]</span>
            <h4>[Event Title 3]</h4>
            <p>[Description of event 3...]</p>
        </div>
    </div>
    <!-- Add more events, alternating left/right -->
</div>
```

### 16. Horizontal Timeline (`.timeline-horizontal`)

An alternative timeline layout displaying events horizontally, useful for sequences where vertical space is limited.

*   **Container:** `<div class="timeline-horizontal">` - Uses flexbox and allows horizontal scrolling if content overflows.
*   **Event Wrapper:** `<div class="timeline-horizontal-event">` - Represents a single point/event on the timeline.
*   **Event Content:** `<div class="timeline-horizontal-content">` - The box containing the event details.
    *   **Date/Year:** `<span class="timeline-horizontal-date">[Date/Year]</span>`
    *   **Title:** `<h4>[Event Title]</h4>`
    *   **Description:** `<p>[Event Description]</p>`
*   **Styling:** Features top and bottom border lines acting as the main axis. Each event has a circular marker positioned below the bottom line. Connecting lines are drawn between markers (via `::before` on the event wrapper). Includes fade-in animation.

```html
<div class="timeline-horizontal">
    <div class="timeline-horizontal-event">
        <div class="timeline-horizontal-content">
            <span class="timeline-horizontal-date">[Date 1]</span>
            <h4>[Event 1]</h4>
            <p>[Desc 1]</p>
        </div>
    </div>
    <div class="timeline-horizontal-event">
        <div class="timeline-horizontal-content">
            <span class="timeline-horizontal-date">[Date 2]</span>
            <h4>[Event 2]</h4>
            <p>[Desc 2]</p>
        </div>
    </div>
    <div class="timeline-horizontal-event">
        <div class="timeline-horizontal-content">
            <span class="timeline-horizontal-date">[Date 3]</span>
            <h4>[Event 3]</h4>
            <p>[Desc 3]</p>
        </div>
    </div>
    <!-- Add more events -->
</div>
```

### 17. Definition List with Icons (`.definition-list-alt`)

Used for displaying a list of terms and their corresponding descriptions, similar to a glossary or definition section, but enhanced with leading icons for each term.

*   **Container:** `<dl class="definition-list-alt">`
*   **Term:** `<dt>`
    *   Contains the `<span class="list-icon">[emoji]</span>` followed by the term, often in `<strong>`.
*   **Description:** `<dd>`
    *   Contains the description text corresponding to the preceding term.
*   **Styling:** Typically renders the `<dd>` indented below the `<dt>` by default browser styles. Custom CSS could be added later to adjust spacing or layout (e.g., using grid or flex for a more table-like appearance if needed, although `<dl>` is semantically correct for definitions).

```html
<dl class="definition-list-alt">
    <dt>
        <span class="list-icon">[emoji1]</span> <strong>[Term 1]:</strong>
    </dt>
    <dd>
        [Description for Term 1...]
    </dd>
    <dt>
        <span class="list-icon">[emoji2]</span> <strong>[Term 2]:</strong>
    </dt>
    <dd>
        [Description for Term 2...]
    </dd>
    <!-- Add more dt/dd pairs -->
</dl>
```

## Other Styled Elements

*   **Blockquotes (`<blockquote>`):** Used within `.quote-box` (which is just an `.info-box`). Styled with left border, italic font.
*   **Horizontal Rule (`<hr>`):** `.popup-divider` class used in achievement popup for a styled separator.
*   **Emphasis (`<em>`, `<strong>`):** Standard browser rendering (italic, bold).
*   **Small Text (`<small>`):** Standard browser rendering (smaller font size).

## Utility Classes

*   `.animated`: Added to `<section>` for fade-in animation.
*   `.animated-children-stagger`: Added to a container (`.flex-container`, etc.) to make its direct children fade in sequentially using `animation-delay`.

This guide provides the building blocks. Combine these components within subsections to structure the study guide content effectively.

### 18. Portrait Modal with Biography (`.portrait-modal`)

A reusable, interactive modal for displaying a large portrait image alongside a detailed, dynamic biography and a link to a relevant external resource (e.g., Wikipedia). Used for key figures in study guides.

*   **Trigger:** Any `<img class="portrait-img" data-person="[key]">` element. Clicking opens the modal.
*   **Modal Structure:**
    *   `<div id="portrait-modal" class="portrait-modal">`
        *   `<button class="portrait-modal-close">` (close button)
        *   `<div class="portrait-modal-content">` (flex row)
            *   `<div class="portrait-modal-bio" id="portrait-modal-bio">` (left column, biography)
            *   `<img id="portrait-modal-img" class="portrait-modal-img">` (right column, large image)
*   **Dynamic Content:**
    *   The modal is populated via JavaScript using a mapping from `data-person` keys to biography text and external links.
    *   The biography can be multi-paragraph and should go beyond the overview in the main guide.
    *   A link to the person's Wikipedia page (or other resource) is included at the bottom of the bio.
*   **Styling:**
    *   `.portrait-modal-content` uses flexbox for a two-column layout (bio left, image right), responsive for mobile.
    *   `.portrait-modal-bio` for the biography and link.
    *   `.portrait-modal-img` for the blown-up portrait.
    *   `.portrait-modal-wikilink` for the external link.

```html
<!-- Example trigger in guide content -->
<img src="[portrait-url]" alt="[Name]" class="portrait-img" data-person="[key]" onclick="openPortraitModal(this)">

<!-- Modal structure at end of <body> -->
<div id="portrait-modal" class="portrait-modal" onclick="closePortraitModal(event)">
  <button class="portrait-modal-close" onclick="closePortraitModal(event)">&times;</button>
  <div class="portrait-modal-content">
    <div class="portrait-modal-bio" id="portrait-modal-bio">
      <!-- Biography and link injected by JS -->
    </div>
    <img id="portrait-modal-img" class="portrait-modal-img" src="" alt="Porträtt">
  </div>
</div>
```

*The modal is initialized and populated by JavaScript. See the ideologies guide for a full implementation example.*
