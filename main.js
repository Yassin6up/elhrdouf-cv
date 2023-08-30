import * as THREE from "three";
import './style.css'
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
  canvas: document.getElementById('bg'),
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
let pc = null;
loader.load('./source/pc.glb', (gltf) => {
  pc = gltf.scene
  zoomIn(pc)
  pc.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
    }
  });


  
  scene.add(pc);
  pc.position.set(0,0,0)
  pc.rotation.x = 1
  // camera.position.set(10, 5, 10)
  controls.target.copy(pc.position)

  zoomIn(pc)

}, undefined, (err) => {
  console.log(err);
})
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
  
  // mixers.forEach((mixer) => {
  //   mixer.update(clock.getDelta());
  // });
  renderer.render(scene, camera);
}
if (WebGL.isWebGLAvailable()) {

  // Initiate function or other initializations here
  animate();

} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}



// let brain = null;
// loader.load('./source/brain/brain.glb', (gltf) => {
//   brain = gltf.scene

//   brain.traverse((child) => {
//     if (child.isMesh) {
//       child.material.side = THREE.DoubleSide;
//     }
//   });



//   // scene.add(brain);
//   brain.position.x = 10


//   // Apply the scale to the model
//   brain.scale.set(1, 1, 1);
//   // controls.target.copy(brain.position)

//   // zoomIn(brain)

// }, undefined, (err) => {
//   console.log(err);
// })


