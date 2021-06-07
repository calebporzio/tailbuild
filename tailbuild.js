#!/usr/bin/env node

let autoprefixer = require('autoprefixer')
let tailwindcss = require('tailwindcss')
let chokidar = require('chokidar')
let postcss = require('postcss')
let mkdirp = require('mkdirp')
let chalk = require('chalk')
let path = require('path')
let arg = require('arg')
let fs = require('fs')

let args = arg({
    '--files': [String],
    '--config': String,
    '--output': String,
    '--input': String,
    '--minify': Boolean,
    '--watch': Boolean,
    '--production': Boolean,
    '-c': '--config',
    '-f': '--files',
    '-o': '--output',
    '-i': '--input',
    '-m': '--minify',
    '-w': '--watch',
    '--purge': '--files',
});

let output = args['_'][0] || args['--output']
let input = args['--input']
let referenceFiles = args['--files']
let shouldWatch = args['--watch']
let shouldMinify = args['--minify']
let production = args['--production']

if (! output) throw new Error('Missing required output file: --output, -o, or first argument');
if (referenceFiles.length === 0) throw new Error('Must provide at least one purge file or directory: --files, -f');

if (shouldWatch) process.env.TAILWIND_MODE = 'watch'

let processors = [tailwindcss({ config: getConfig() }), autoprefixer]

if (process.env.NODE_ENV === 'production' || shouldMinify || production) {
    process.env.NODE_ENV = 'production'

    processors.push(require('cssnano'))
}

let css = input ? fs.readFileSync(input) : '@tailwind base; @tailwind components; @tailwind utilities;'

if (shouldWatch) {
    chokidar.watch(referenceFiles, {ignored: /[\/\\]\./}).on('all', () => {
        processCSS()
    })
} else {
    processCSS()
}

function processCSS() {
    console.log(chalk.cyan('♻️ tailbuilding...'));

    mkdirp.sync(path.dirname(output))

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
        purge: referenceFiles,
    }
}
