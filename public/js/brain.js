import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

import TWEEN from '@tweenjs/tween.js'

import {
  Easing
} from '@tweenjs/tween.js';


import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('brain'),
  antialias: true,
  alpha: true
});

let hlight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(hlight)
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth camera movement
controls.dampingFactor = 0.7; // Adjust the damping factor for the camera movement speed
controls.screenSpacePanning = true; // Allow panning in screen space rather than model space

camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 0);




const loader = new GLTFLoader()

let dron;
let mixers = [];
const clock = new THREE.Clock();
loader.load("../assets/dron.gltf", (gltf) => {
  dron = gltf.scene
  scene.add(dron);

  
  dron.position.z = -5

  controls.target.copy(dron.position)

  const animations = gltf.animations;
  if (animations && animations.length > 0) {
    const mixer = new THREE.AnimationMixer(dron);

    // Store the mixer in the mixers array
    mixers.push(mixer);

    // Add each animation to the mixer and set looping
    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);

      action.clampWhenFinished = true; // Keep the last frame
      action.play();

      action.loop = THREE.LoopRepeat;
      action.repetitions = Infinity; // Set infinite repetitions
      action.clampWhenFinished = false;
      action.reset(); // Reset the action to the beginning when it finishes
      action.play();
    });
    // Call the animation loop to update the mixer
    animate();
  }
});










function zoomIn(object) {
  const box = new THREE.Box3().setFromObject(object); // Calculate the bounding box of the house object
  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere); // Calculate the bounding sphere of the house object

  const target = sphere.center; // Set the target to the center of the bounding sphere
  const distance = sphere.radius * 2; // Calculate the distance based on the diameter of the bounding sphere
  const maxZoomDistance = 100
  const maxDistance = Math.min(distance, maxZoomDistance);

  camera.position.copy(target).add(new THREE.Vector3(0, 0, maxDistance));
  // controls.target.copy(target);
}



function animate() {
  requestAnimationFrame(animate)
   controls.update();
  
  mixers.forEach((mixer) => {
    mixer.update(clock.getDelta());
  });
  renderer.render(scene, camera);
}





if (WebGL.isWebGLAvailable()) {

    // Initiate function or other initializations here
    animate();
  
  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
  }
  