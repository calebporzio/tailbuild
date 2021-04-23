# Tailbuild

A simple command to build a JIT Tailwind CSS file for your project without all the fuss.

Run the following command and you're off!

```bash
npx tailbuild [output file] --purge=[files to use as a purge reference]

# For example:
npx tailbuild dist/tailwind.css --purge="./public/**/*.html"

# The above command will scour all HTML files in your /public directory
# and build a Tailwind CSS file with only what's necessary.
```

| Framework | Example Command |
| --- | --- |
| Laravel | `npx tailbuild public/css/app.css -p resources/views/**/*.blade.php` |

| Options | Description |
| --- | --- |
| `-o, --output` |  |
| `-p, --purge` |  |
| `-w, --watch` |  |
| `-i, --input` |  |
| `-c, --config` |  |
| `-m, --minify` |  |
| `--production` |  |
