const fs = require('fs');
const path = require('path');

const srcLarge = '/home/dp/.gemini/antigravity/brain/2770284f-34e1-444e-8f7e-a5a1c1944c32/transparent_logo_1781055497777.png';
const srcIcon = '/home/dp/.gemini/antigravity/brain/2770284f-34e1-444e-8f7e-a5a1c1944c32/icon_small_1781056327061.png';
const destDir = path.join(__dirname, 'assets', 'images');

try {
  if (fs.existsSync(srcLarge)) {
    fs.copyFileSync(srcLarge, path.join(destDir, 'splash-icon.png'));
    console.log('Copied large transparent logo to splash-icon.png');
  }
  if (fs.existsSync(srcIcon)) {
    fs.copyFileSync(srcIcon, path.join(destDir, 'icon.png'));
    fs.copyFileSync(srcIcon, path.join(destDir, 'android-icon-foreground.png'));
    fs.copyFileSync(srcIcon, path.join(destDir, 'favicon.png'));
    console.log('Copied optimized transparent icon to app icons (icon, android-icon-foreground, favicon).');
  }
} catch (err) {
  console.error('Error copying logo assets:', err);
}

const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
