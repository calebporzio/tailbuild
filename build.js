#!/usr/bin/env node

let autoprefixer = require('autoprefixer')
let tailwindcss = require('tailwindcss')
let chokidar = require('chokidar')
let postcss = require('postcss')
let chalk = require('chalk')
let arg = require('arg')
let fs = require('fs')

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

if (shouldWatch) process.env.TAILWIND_MODE = 'watch'

let processors = [tailwindcss({ config: getConfig() }), autoprefixer]

if (process.env.NODE_ENV === 'production' || shouldMinify || production) {
    process.env.NODE_ENV = 'production'

    processors.push(require('cssnano'))
}

let css = input ? fs.readFileSync(input) : '@tailwind base; @tailwind components; @tailwind utilities;'

if (shouldWatch) {
    chokidar.watch(purges, {ignored: /[\/\\]\./}).on('all', () => {
        processCSS()
    })
} else {
    processCSS()
}

function processCSS() {
    console.log(chalk.cyan('♻️ tailbuilding...'));

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
        purge: purges,
    }
}
