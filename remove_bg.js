const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('src/assets/images/intro-bg.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        // if pixel is near white
        if (this.data[idx] > 240 && this.data[idx+1] > 240 && this.data[idx+2] > 240) {
          this.data[idx+3] = 0; // alpha to 0
        }
      }
    }
    this.pack().pipe(fs.createWriteStream('src/assets/images/intro-bg-transparent.png'));
  });
