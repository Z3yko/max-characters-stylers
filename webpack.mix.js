const mix = require('laravel-mix');
mix.js('src/index.js', 'build').minify('build/index.css')