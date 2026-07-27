const fs = require('fs');
const PNG = require('pngjs').PNG;
const path = require('path');

const files = [
  "ChatGPT Image Jul 24, 2026, 10_43_50 PM (1).png",
  "ChatGPT Image Jul 24, 2026, 10_43_54 PM (2).png"
];

files.forEach((file, index) => {
  if (!fs.existsSync(file)) return console.log("Missing", file);
  
  fs.createReadStream(file)
    .pipe(new PNG({ filterType: 4 }))
    .on('parsed', function() {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          let r = this.data[idx];
          let g = this.data[idx+1];
          let b = this.data[idx+2];
          
          let dist = Math.sqrt(Math.pow(r-255, 2) + Math.pow(g-255, 2) + Math.pow(b-255, 2));
          
          if (dist < 30) {
            this.data[idx+3] = 0;
          } else if (dist < 60) {
            let alpha = Math.floor(255 * ((dist - 30) / 30));
            this.data[idx+3] = alpha;
          }
        }
      }
      this.pack().pipe(fs.createWriteStream(`src/assets/images/custom_asset_${index+7}.png`));
      console.log(`Processed custom_asset_${index+7}.png`);
    });
});
