const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('src/assets/images/intro-bg.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    console.log("Top left pixel:", this.data[0], this.data[1], this.data[2]);
  });
