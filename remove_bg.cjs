const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('src/assets/images/intro-bg.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        let r = this.data[idx];
        let g = this.data[idx+1];
        let b = this.data[idx+2];
        
        // Distance from 250, 240, 234
        let dist = Math.sqrt(Math.pow(r-250, 2) + Math.pow(g-240, 2) + Math.pow(b-234, 2));
        
        if (dist < 20) {
          // It's background, make it transparent
          this.data[idx+3] = 0;
        } else if (dist < 40) {
          // Anti-aliasing edge, make it partially transparent
          let alpha = Math.floor(255 * ((dist - 20) / 20));
          this.data[idx+3] = alpha;
        }
      }
    }
    this.pack().pipe(fs.createWriteStream('src/assets/images/intro-bg-transparent.png'));
  });
