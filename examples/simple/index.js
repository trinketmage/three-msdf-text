
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Glyph, GlyphGeometry, GlyphMaterial } from '../../src/index.js'
import font from './Love.json'

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
camera.position.z = 500;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setAnimationLoop(animate);
handleResize()
window.addEventListener('resize', handleResize, false);
document.body.appendChild(renderer.domElement);

const onLoaded = () => {
  const mapUniform = new THREE.Uniform(texture);

  const material = new GlyphMaterial({
    uniforms: {
      map: mapUniform
    }
  });
  const geometry = new GlyphGeometry({
    text: 'LO-VÉ.',
    font,
  });
  const glyph = new Glyph({ geometry, material });
  scene.add(glyph);
  glyph.center();
}

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load( "/Love.png", onLoaded);

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}