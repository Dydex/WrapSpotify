const fs = require('fs');
const path = require('path');

const src = '/home/dp/.gemini/antigravity/brain/2770284f-34e1-444e-8f7e-a5a1c1944c32/transparent_logo_1781055497777.png';
const destDir = path.join(__dirname, 'assets', 'images');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(destDir, 'splash-icon.png'));
    fs.copyFileSync(src, path.join(destDir, 'icon.png'));
    fs.copyFileSync(src, path.join(destDir, 'android-icon-foreground.png'));
    fs.copyFileSync(src, path.join(destDir, 'favicon.png'));
    console.log('Successfully copied transparent logo to assets/images!');
  }
} catch (err) {
  console.error('Error copying logo:', err);
}

const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
