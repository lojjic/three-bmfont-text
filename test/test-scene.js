/*
  Simple example test scene for spawning the tests, based off of three orbit example
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, controls, scene, renderer, clock;

let animationCallback;
export function testScene(options) {
  animationCallback = options.animate;
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  // camera
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 1, 2, -4 );
  // controls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.listenToKeyEvents( window ); // optional
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;
  controls.minDistance = 0;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2;
  // lights
  const dirLight1 = new THREE.DirectionalLight( 0xffffff );
  dirLight1.position.set( 1, 1, 1 );
  scene.add( dirLight1 );
  const dirLight2 = new THREE.DirectionalLight( 0x002288 );
  dirLight2.position.set( - 1, - 1, - 1 );
  scene.add( dirLight2 );
  const ambientLight = new THREE.AmbientLight( 0x222222 );
  scene.add( ambientLight );
  window.addEventListener( 'resize', onWindowResize );
  animate();
  return { scene, controls, camera };
}
  
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  const dt = clock.getDelta();  
  if (animationCallback) animationCallback(dt);
  render();
}
  
function render() {
  renderer.render( scene, camera );
}