/*
  This is an example of 3D rendering with
  a custom shader, special per-line shader effects,
  and glslify.
 */
import * as THREE from 'three';
import {createGeometry} from '../'

import {load} from './load';
import {testScene} from './test-scene';
import quote from 'sun-tzu-quotes'

let duration = 3
let time = 0
load({
  font: 'fnt/DejaVu-sdf.fnt',
  image: 'fnt/DejaVu-sdf.png'
}, init);

function next (geom, text) {
  // set new text string
  geom.update(quote());
  const lines = geom.visibleGlyphs.map(function (glyph) {
    return glyph.line;
  })

  const lineCount = lines.reduce(function (a, b) {
    return Math.max(a, b);
  }, 0)

  // for each quad, let's give it a vertex attribute
  // with the line index
  const lineData = lines.map(function (line) {
    // map to 0..1 for attribute
    const t = lineCount <= 1 ? 1 : (line / (lineCount - 1));
    // quad - 4 verts
    return [ t, t, t, t ];
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []);

  // update the "line" vertex attribute
  geom.setAttribute('line', new THREE.BufferAttribute(new Float32Array(lineData), 1));

  // center the text
  const layout = geom.layout;
  text.position.x = -layout.width / 2;
  text.position.y = layout.height / 2;
}

function init(font, texture) {
  const geom = createGeometry({
    font: font,
    align: 'center',
    width: 500,
    flipY: texture.flipY
  });
  const material = new THREE.RawShaderMaterial({
    vertexShader: require('./shaders/fx.vert'),
    fragmentShader: require('./shaders/fx.frag'),
    uniforms: {
      animate: { type: 'f', value: 1 },
      iGlobalTime: { type: 'f', value: 0 },
      map: { type: 't', value: texture },
      color: { type: 'c', value: new THREE.Color('#000') }
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false
  });

  const text = new THREE.Mesh(geom, material);

  // scale it down so it fits in our 3D units
  const textAnchor = new THREE.Object3D();
  textAnchor.scale.multiplyScalar(-0.005);
  textAnchor.add(text);

  const { scene, camera, controls } = testScene({ animate: (dt) => {
    time += dt;
    material.uniforms.iGlobalTime.value = time;
    material.uniforms.animate.value = time / duration;
    if (time > duration) {
      time = 0;
      next(geom, text);
    }
  }});

  next(geom, text);
  console.error('init', font, scene, camera, controls);
  scene.add(textAnchor);
}
