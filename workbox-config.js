module.exports = {
  swSrc: 'src/assets/service-worker.js',     // source file
  swDest: 'dist/photobooth-app/browser/service-worker.js', // output after build
  globDirectory: 'dist/photobooth-app/browser', // directory to cache
  globPatterns: [
    '**/*.{html,js,css,woff2,png,jpg,webp,svg,json}'
  ],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
};