import sharp from 'sharp';
import { glob } from 'glob';
import { stat } from 'fs/promises';
import path from 'path';

const files = await glob('public/**/*.png', {
  ignore: ['public/favicon*']
});

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const webpPath = file.replace(/\.png$/, '.webp');
  const before = (await stat(file)).size;

  await sharp(file)
    .webp({ quality: 80 })
    .toFile(webpPath);

  const after = (await stat(webpPath)).size;
  totalBefore += before;
  totalAfter += after;

  const saving = ((1 - after / before) * 100).toFixed(0);
  console.log(`${path.basename(file)} → ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (${saving}% saved)`);
}

console.log(`\nTotal: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB (${((1 - totalAfter/totalBefore) * 100).toFixed(0)}% saved)`);
