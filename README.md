# ♻️ tailbuild

A simple command to build a JIT Tailwind CSS file for your project without all the fuss.

Run the following command and you're off!

```bash
npx tailbuild [output file] --files=[files to search for CSS classes in and generate Tailwind from]
```

Here's a specific example where tailbuild will scour all the HTML files in the `public/` directory for Tailwind classes and build a custom CSS file: `dist/tailwind.css`

```bash
npx tailbuild dist/tailwind.css --files="./public/**/*.html"
```

### File Watching
You can configure tailbuild to watch these "markup reference" files and re-build if they are changed with the `--watch` option:

```bash
npx tailbuild dist/tailwind.css --files="./public/**/*.html" --watch
```

### Production Builds
By adding `--production` tailbuild will minify the output CSS file.

```bash
npx tailbuild dist/tailwind.css --files="./public/**/*.html" --production
```

### Framework Examples
| Framework | Example Command |
| --- | --- |
| Laravel | `npx tailbuild public/css/tailwind.css --files="resources/views/**/*.blade.php"` |
| [Your Favorite Framework] | [Open A PR!](https://github.com/calebporzio/tailbuild/pulls) |

### Command Options
| Options | Description |
| --- | --- |
| `-o, --output` | The file path to store tailbuild's output Tailwind CSS file |
| `-f, --files, --purge` | Specify (optionally multiple) glob patterns or files to use as a purge reference and a file watcher list if using `--watch` |
| `-w, --watch` | Watch all purge reference files for changes and re-build the CSS output |
| `-i, --input` | Specify a CSS input file (containing `@tailwind base, etc...`) for tailbuild to use as the basis for it's PostCSS build |
| `-c, --config` | Specify a custom Tailwind config file for reference when building the Tailwind CSS output file |
| `-m, --minify` | Minify all CSS output files using [cssnano](https://github.com/cssnano/cssnano) |
| `--production` | Minify all CSS output AND set NODE_ENV to "production" for other optimizations within Tailwind |

### How It Works

Tailbuild's pretty simple. Take a look at its only file of code for info: [tailbuild.js](https://github.com/calebporzio/tailbuild/blob/main/tailbuild.js)

## Enjoy!
