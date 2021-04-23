# tailbuild

A simple command to build a JIT Tailwind CSS file for your project without all the fuss.

Run the following command and you're off!

```bash
npx tailbuild [output file] --purge=[files to use as a purge reference]
```

Here's a specific example where tailbuild will scour all the HTML files in the `public/` directory for Tailwind classes and build a custom CSS file: `dist/tailwind.css`

```bash
npx tailbuild dist/tailwind.css --purge="./public/**/*.html"
```

You can configure tailbuild to watch these "purge reference" files and re-build if they are changed with the `--watch` option:

```bash
npx tailbuild dist/tailwind.css --purge="./public/**/*.html" --watch
```

| Framework | Example Command |
| --- | --- |
| Laravel | `npx tailbuild public/css/app.css --purge="resources/views/**/*.blade.php"` |

| Options | Description |
| --- | --- |
| `-o, --output` |  |
| `-p, --purge` |  |
| `-w, --watch` |  |
| `-i, --input` |  |
| `-c, --config` |  |
| `-m, --minify` |  |
| `--production` |  |
