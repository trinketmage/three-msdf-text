import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Glyph, GlyphGeometry, GlyphMaterial } from '../../src/index.js'
// import font from './Roboto-Regular.json'
import font from './Love.json'

import { Pane } from 'tweakpane';
import { responsive} from 'sword'
console.log(responsive);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 3000);
camera.position.z = 500;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

const textureLoader = new THREE.TextureLoader();

const controls = new OrbitControls(camera, renderer.domElement);

let glyph = null;

const pane = new Pane();

renderer.setAnimationLoop(animate);
handleResize()
window.addEventListener('resize', handleResize, false);
document.body.appendChild(renderer.domElement);

const PARAMS = {
  text: 'LO-VÉ.',
  // text: 'LO-VÉ.\r\nLove\r\nLO-VÉ.\r\nLove',
  anchor: {
    x: 0.5,
    y: 0.5
  },
  color: 0xece9e3,
  align: 'left',
  // width: null,
  letterSpacing: 0,
  progress: 0,
  lineHeight: font.common.lineHeight,
};

const setDebug = () => {
  pane
    .addBinding(PARAMS, 'text')
    .on('change', () => {
      glyph.update({ text: PARAMS.text })
    });
  pane
    .addBinding(
      PARAMS,
      'color',
      {
        label: 'color',
        view: 'color'
      }
    )
    .on('change', () => {
      glyph.material.uniforms.color.value = new THREE.Color(PARAMS.color)
    });
  pane
    .addBinding(
      PARAMS,
      'letterSpacing',
      {
        step: 1
      }
    )
    .on('change', () => {
      // glyph.material.uniforms.color.value = new THREE.Color(PARAMS.color)
      glyph.update({ letterSpacing: PARAMS.letterSpacing })
    });

  pane
    .addBinding(
      PARAMS,
      'progress',
      {
        step: 0.01,
        min: 0,
        max: 1,
      }
    )
    .on('change', () => {
      glyph.material.uniforms.progress.value = PARAMS.progress
    });

  // pane
  //   .addBinding(
  //     PARAMS,
  //     'lineHeight',
  //     {
  //       step: 1
  //     }
  //   )
  //   .on('change', () => {
  //     glyph.update({ lineHeight: PARAMS.lineHeight })
  //   });
  // pane
  //   .addBinding(PARAMS, 'align', {
  //     label: 'textAlign',
  //     options: {
  //       left: 'left',
  //       center: 'center',
  //       right: 'right'
  //     },
  //   })
  //   .on('change', () => {
  //     glyph.update({ align: PARAMS.align })
  //   });
  pane
    .addBinding(PARAMS, 'anchor', {
      x: { step: 0.01, min: 0, max: 1 },
      y: { step: 0.01, min: 0, max: 1, inverted: true },
    })
    .on('change', () => {
      const { x, y } = PARAMS.anchor
      glyph.anchor.set(x, y)
      glyph.update();
    });
  const folder = pane.addFolder({
    title: "Glyph presets",
    expanded: false
  });
  ['center', 'alignTop', 'alignRight', 'alignBottom', 'alignLeft'].forEach((property) => {
    folder
      .addButton({
        title: property
      })
      .on('click', () => {
        glyph[property]()
        PARAMS.anchor.x = glyph.anchor.x;
        PARAMS.anchor.y = glyph.anchor.y;
        pane.refresh();
      });
  });
}

const onLoaded = () => {
  glyph = new Glyph({
    text: PARAMS.text,
    font,
    map: texture,
    color: new THREE.Color(PARAMS.color),
    // width (number, optional) the desired width of the text box, causes word-wrapping and clipping in "pre" mode. Leave as undefined to remove word-wrapping (default behaviour)
    // textAlign (string) can be "left", "center" or "right" (default: left)
    // width: PARAMS.width,
    letterSpacing: PARAMS.letterSpacing,
    // lineHeight: PARAMS.lineHeight
  });
  // glyph.children[0].material.map = textureLoader.load( "/UVChecker.png");

  // low level
  // const mapUniform = new THREE.Uniform(texture)
  
  // const material = new GlyphMaterial({
  //   uniforms: {
  //     map: mapUniform
  //   }
  // });
  // const geometry = new GlyphGeometry({
  //   text: PARAMS.text,
  //   font,

  // });

  // glyph = new Glyph({
  //   geometry,
  //   material
  // });

  glyph.mesh.frustumCulled = false;

  glyph.center();
  scene.add(glyph);

  setDebug()
}

// const texture = textureLoader.load( "/Roboto-Regular.png", onLoaded);
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