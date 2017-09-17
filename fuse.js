const {
  FuseBox,
  QuantumPlugin,
  WebIndexPlugin,
  Sparky,
} = require("fuse-box");
const fse = require('fs-extra');

const PACKAGE_NAME = 'exhibition-interactive-gallery';

const EXAMPLE_DEV_DIST_DIR = 'dev/docs';
const EXAMPLE_PROD_DIST_DIR = 'docs';

const LIB_DEV_DIST_DIR = 'dev/dist';
const LIB_PROD_DIST_DIR = 'dist';

const distDirExample = () => {
  return isProduction ? EXAMPLE_PROD_DIST_DIR : EXAMPLE_DEV_DIST_DIR;
};
const distDirLib = () => {
  return isProduction ? LIB_PROD_DIST_DIR : LIB_DEV_DIST_DIR;
};

let fuseExample, fuseLib, appExample, appLib, vendor, isProduction;

Sparky.task("config", () => {
  fuseExample = new FuseBox({
    homeDir: "src/",
    sourceMaps: {
      inline: false,
    },
    hash: false,
    output: `${distDirExample()}/$name.js`,
    plugins: [
      WebIndexPlugin({
        template: "src/example/index.html",
        path: '.',
      }),
      isProduction && QuantumPlugin({
        removeExportsInterop: true,
        uglify: true,
        treeshake: true,
        bakeApiIntoBundle: 'index',
        containedAPI : true,
        target: 'browser',
      }),
    ],
  });

  fuseLib = new FuseBox({
    homeDir: "src/",
    sourceMaps: {
      inline: false,
    },
    hash: false,
    output: `${distDirLib()}/$name.js`,
    package: {
      // same as in package.json (this is important)
      name: PACKAGE_NAME,
      main: 'src/lib/index.ts',
    },
    globals: {
      [PACKAGE_NAME]: '*',
      // https://github.com/fuse-box/fuse-box/pull/200
      // Doesn't work
      // 'exhibition-interactive-gallery': {
      //   'ExhibitionInteractiveGallery': 'ExhibitionInteractiveGallery',
      // },
    },
    plugins: [
      isProduction && QuantumPlugin({
        removeExportsInterop: true,
        uglify: true,
        treeshake: true,
        bakeApiIntoBundle: `${PACKAGE_NAME}.min.js`,
        containedAPI : true,
        target: 'browser',
      }),
    ],
  });

// bundle app
  appExample = fuseExample.bundle("index").instructions("> example/index.ts");
  appLib = fuseLib.bundle(`${PACKAGE_NAME}.min.js`).instructions("!> lib/index.ts");
});

Sparky.task("default", ["clean", "config", "copy-assets"], () => {
  fuseExample.dev();
// add dev instructions
  appExample.watch().hmr();
  return fuseExample.run();
});

Sparky.task("clean", () => {
  return Sparky.src("dev/").clean("dev/");
});
Sparky.task('copy-assets', () => {
  return fse.copy('docs/assets', 'dev/docs/assets');
});
Sparky.task("prod-env", ["clean"], () => { isProduction = true })
Sparky.task("production", ["prod-env", "config"], () => {
  // comment out to prevent dev server from running (left for the demo)
  // fuse.dev();
  return Promise.all([
    fuseExample.run(),
    fuseLib.run()
  ]);
});
