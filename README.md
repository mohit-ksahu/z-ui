<h1 align="center">ZUI</h1>

<p align="center">
  Zero-dependency UI components built with plain HTML, CSS, and vanilla JavaScript.
</p>

<p align="center">
  <a href="https://mohit-ksahu.github.io/zui/">Live Preview</a>
</p>

---

## Why

Plain HTML, CSS, and JavaScript with no build step, no framework, and no dependencies.
Good fit for static sites, server-rendered apps, or any project where you want polished UI without the overhead.

## Features

- **Zero dependencies**: No npm or bundler required to use it
- **Framework agnostic**: Works with React, Vue, Svelte, or plain HTML
- **Theming**: Fully customizable via CSS variables
- **Dark mode**: Light, dark, and system preference, with View Transitions and a `setTheme` helper
- **Keyboard accessible**: Focus management and ARIA throughout
- **Modern CSS**: Built on `@layer`, `oklch`, `popover`, and CSS Anchor Positioning

## Components (36)

| | | | |
|---|---|---|---|
| Accordion | Avatar | Badge | Breadcrumb |
| Button | Button Group | Card | Checkbox |
| Combobox | Dialog | Dropdown | Hover Card |
| Input | Input Group | Kbd | Label |
| Pagination | Popover | Progress | Radio Group |
| Scroll Area | Select | Separator | Sheet |
| Sidebar | Skeleton | Slider | Spinner |
| Switch | Table | Tabs | Textarea |
| Toast | Toggle | Toggle Group | Tooltip |

## Getting Started

Copy the `components/` folder into your project and include the files in your HTML:

```html
<link rel="stylesheet" href="path/to/components/index.css">
<script type="module" src="path/to/components/index.js"></script>
```

For production, bundle and minify with **esbuild**:

```bash
npx esbuild components/index.js --bundle --minify --format=esm --outfile=index.min.js
npx esbuild components/index.css --bundle --minify --outfile=index.min.css
```

## Browser Support

All modern browsers. CSS Anchor Positioning reached Baseline 2026 and is supported in Chrome 125+, Firefox 147+, and Safari 26+.

## License

MIT