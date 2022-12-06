import loadFont from 'load-bmfont';
import { TextureLoader } from 'three';

// A utility to load a font, then a texture
export function load (opt, cb) {
  loadFont(opt.font, function (err, font) {
    if (err) throw err;
    console.error(opt, font);
    const loader = new TextureLoader();
    loader.load(opt.image, (tex) => {
      console.error(opt, tex);
      cb(font, tex);
    })
  })
}
