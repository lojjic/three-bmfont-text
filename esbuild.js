const path = require('path');
const esbuild = require('esbuild');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');
const { glsl } = require('esbuild-plugin-glsl');
let entry = process.argv[2];
if (!entry) {
  entry = 'test/test-shader.js';
}
(async () => {
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    outfile: 'test/bundle.js',
    inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
    define: {
      global: 'global',
      process: 'process',
      Buffer: 'Buffer'
    },
    plugins: [
      plugin(stdLibBrowser),
      glsl({minify: false}),
    ]
  });
})();
