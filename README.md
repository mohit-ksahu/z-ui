<h1 align="center">Z-UI</h1>

<p align="center">
  UI components built with HTML, CSS, and vanilla JavaScript.
</p>

<p align="center">
  <a href="https://mohit-ksahu.github.io/z-ui/">Components</a> &bull;
  <a href="#getting-started">Quick Start</a> &bull;
  <a href="#license">License</a>
</p>

---

A collection of accessible UI components you can copy directly into your project. Tweak the styles, customize the behavior, and make them your own.

## Features

- **Copy and paste**: Take what you need, leave what you don't. No npm or build step needed.
- **Works everywhere**: Plain HTML, React, Vue, Svelte, or backend templates.
- **Accessible**: Keyboard navigation, focus states, and ARIA attributes included.
- **Easy theming**: Customize colors, fonts, and borders with CSS variables.
- **Dark mode**: Supports light, dark, and system preferences out of the box.

## Getting Started

Copy the `components/` folder into your project and link the files in your HTML:

```html
<link rel="stylesheet" href="path/to/components/index.css">
<script type="module" src="path/to/components/index.js"></script>
```

### Production Build (Optional)

Bundle and minify into single files with esbuild:

```bash
npx esbuild components/index.js --bundle --minify --format=esm --outfile=index.min.js
npx esbuild components/index.css --bundle --minify --outfile=index.min.css
```

## Components

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

## Browser Support

Works on all modern browsers (Chrome, Edge, Firefox, Safari).

## License

MIT
