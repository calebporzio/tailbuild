#!/usr/bin/env node

const autoprefixer = require('autoprefixer')
const chokidar = require('chokidar')
const arg = require('arg');
const fs = require('fs')

let args = arg({
    '--purge': [String],
    '--config': String,
    '--output': String,
    '--minify': Boolean,
    '--watch': Boolean,
    '--production': Boolean,
    '-c': '--config',
    '-p': '--purge',
    '-o': '--output',
    '-m': '--minify',
    '-w': '--watch',
});

let output = args['_'][0] || args['--output']
let input = args['_'][1] || args['--input']
let purges = args['--purge']
let shouldWatch = args['--watch']
let shouldMinify = args['--minify']
let production = args['--production']

if (! output) throw new Error('Missing required output file: --output, -o, or first argument');
if (purges.length === 0) throw new Error('Must provide at least one purge directory: --purge, -p');

if (process.env.NODE_ENV === 'production' || shouldMinify || production) {
    process.env.NODE_ENV = 'production'

    processors.push(require('cssnano'))
}

let css = input ? fs.readFileSync(input) : '@tailwind base; @tailwind components; @tailwind utilities;'

if (shouldWatch) {
    process.env.TAILWIND_MODE = 'watch'

    let watcher = chokidar.watch(purges, {ignored: /[\/\\]\./})

    watcher.on('all', () => {
        processCSS()
    })
} else {
    processCSS()
}

function processCSS() {
    const tailwindcss = require('tailwindcss')
    const postcss = require('postcss')

    let processors = [tailwindcss({ config: getConfig() }), autoprefixer]

    postcss(processors)
        .process(css, { from: input, to: output })
        .then(result => {
            fs.writeFile(output, result.css, () => true)

            if (result.map) {
                fs.writeFile(output+'.map', result.map.toString(), () => true)
            }
        })
}

function getConfig() {
    if (args['--config']) return args['--config']

    if (fs.existsSync('tailwind.config.js')) return 'tailwind.config.js'

    return {
        mode: 'jit',
        purge: [
            './index.html',
        ],
    }
}
