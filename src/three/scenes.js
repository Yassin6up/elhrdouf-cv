import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import glyphFont from './glyphs.typeface.json';

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const isSmall = () => window.innerWidth < 860;
const lowPower = isTouch || (navigator.hardwareConcurrency || 8) <= 4;
const MAX_DPR = lowPower ? 1.5 : 2;

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

/* =========================================================
   Shared scene shell: renderer, resize, visibility-gated loop,
   adaptive pixel ratio.
   ========================================================= */
function createStage(canvas, { fov = 35, env = true } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);

  if (env) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }

  let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    stage.onResize?.(w, h);
  };

  const clock = new THREE.Clock(false);
  let visible = false;
  let running = false;
  // Adaptive quality: if the first ~90 frames are slow, drop the pixel ratio.
  let frames = 0;
  let acc = 0;
  let tuned = false;

  const loop = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!tuned) {
      acc += dt;
      if (++frames === 90) {
        tuned = true;
        const fps = frames / acc;
        if (fps < 45 && dpr > 1) {
          dpr = 1;
          resize();
        }
      }
    }
    stage.update?.(dt, clock.elapsedTime);
    renderer.render(scene, camera);
  };

  const sync = () => {
    const should = visible && !document.hidden;
    if (should === running) return;
    running = should;
    if (should) {
      clock.start();
      renderer.setAnimationLoop(loop);
    } else {
      clock.stop();
      renderer.setAnimationLoop(null);
    }
  };

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      sync();
    },
    { rootMargin: '100px' },
  ).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(resize).observe(canvas);

  const stage = { renderer, scene, camera, resize, renderOnce: () => renderer.render(scene, camera) };
  return stage;
}

/* Calls `fn` once the element is within `margin` of the viewport. */
function whenNear(el, fn, margin = '400px') {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      fn();
    },
    { rootMargin: margin },
  );
  io.observe(el);
}

/* =========================================================
   HERO: procedural laptop with a live-coding screen,
   floating code glyphs and a particle field.
   ========================================================= */
const CODE = [
  [['k', 'const '], ['v', 'developer'], ['p', ' = {']],
  [['p', '  name: '], ['s', "'Yassine Ait Elhrdouf'"], ['p', ',']],
  [['p', '  role: '], ['s', "'Full Stack & Mobile Dev'"], ['p', ',']],
  [['p', '  location: '], ['s', "'Morocco 🇲🇦'"], ['p', ',']],
  [['p', '  stack: ['], ['s', "'React'"], ['p', ', '], ['s', "'React Native'"], ['p', ', '], ['s', "'Node'"], ['p', '],']],
  [['p', '  platforms: ['], ['s', "'web'"], ['p', ', '], ['s', "'iOS'"], ['p', ', '], ['s', "'Android'"], ['p', '],']],
  [['p', '};']],
  [['p', '']],
  [['k', 'async function '], ['f', 'build'], ['p', '(idea) {']],
  [['k', '  const '], ['v', 'app'], ['p', ' = '], ['k', 'await '], ['f', 'design'], ['p', '(idea);']],
  [['k', '  return '], ['f', 'ship'], ['p', '(app.'], ['f', 'optimize'], ['p', '());']],
  [['p', '}']],
  [['c', '// high-quality apps, every screen ✨']],
  [['f', 'build'], ['p', '('], ['s', "'your next project'"], ['p', ');']],
];
const CODE_COLORS = { k: '#f472b6', v: '#7dd3fc', p: '#d4d4e0', s: '#86efac', f: '#c4b5fd', c: '#6b6b80' };
const TOTAL_CHARS = CODE.reduce((n, line) => n + line.reduce((m, [, t]) => m + [...t].length, 0) + 1, 0);

function createCodeScreen() {
  const W = 1024;
  const H = 640;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const draw = (typed, caretOn) => {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#0f0f1a');
    g.addColorStop(1, '#151027');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // title bar
    ctx.fillStyle = '#1b1b2b';
    ctx.fillRect(0, 0, W, 44);
    [['#ff5f57', 28], ['#febc2e', 52], ['#28c840', 76]].forEach(([c, x]) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, 22, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#8b8ba0';
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillText('portfolio.js', 440, 28);

    ctx.font = '500 25px "JetBrains Mono", monospace';
    const lh = 38;
    let left = typed;
    let caret = null;
    for (let i = 0; i < CODE.length; i++) {
      const y = 92 + i * lh;
      ctx.fillStyle = '#3d3d52';
      ctx.fillText(String(i + 1).padStart(2, ' '), 18, y);
      let x = 72;
      for (const [kind, text] of CODE[i]) {
        if (left <= 0) break;
        const chars = [...text];
        const part = chars.slice(0, left).join('');
        left -= chars.length;
        ctx.fillStyle = CODE_COLORS[kind];
        ctx.fillText(part, x, y);
        x += ctx.measureText(part).width;
      }
      if (left <= 0 && !caret) caret = [x, y];
      left -= 1; // newline
      if (left < 0 && caret) break;
    }
    if (caretOn) {
      const [cx, cy] = caret || [72, 92 + (CODE.length - 1) * lh];
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(cx + 2, cy - 22, 12, 28);
    }
    texture.needsUpdate = true;
  };

  let typed = 0;
  let t = 0;
  let hold = 0;
  let lastCaret = null;
  draw(0, true);
  return {
    texture,
    update(dt) {
      t += dt;
      const caretOn = Math.floor(t * 2) % 2 === 0;
      let dirty = caretOn !== lastCaret;
      lastCaret = caretOn;
      if (typed < TOTAL_CHARS) {
        const next = Math.min(TOTAL_CHARS, typed + dt * 38);
        if (Math.floor(next) !== Math.floor(typed)) dirty = true;
        typed = next;
      } else if ((hold += dt) > 5) {
        hold = 0;
        typed = 0;
        dirty = true;
      }
      if (dirty) draw(Math.floor(typed), caretOn);
    },
  };
}

function buildLaptop(screenTexture) {
  const laptop = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x2b2b3a, metalness: 0.85, roughness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0c0c14, metalness: 0.4, roughness: 0.6 });

  const base = new THREE.Mesh(new RoundedBoxGeometry(3.2, 0.12, 2.2, 3, 0.05), shell);
  laptop.add(base);

  // keyboard
  const cols = 13;
  const rows = 5;
  const keyGeo = new THREE.BoxGeometry(0.17, 0.035, 0.17);
  const keys = new THREE.InstancedMesh(keyGeo, new THREE.MeshStandardMaterial({ metalness: 0.2, roughness: 0.7 }), cols * rows);
  const m = new THREE.Matrix4();
  const c = new THREE.Color();
  const accents = new Set([3, 17, 29, 44, 51, 60]);
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      const i = r * cols + k;
      m.makeTranslation(-1.26 + k * 0.21, 0.07, -0.85 + r * 0.21);
      keys.setMatrixAt(i, m);
      keys.setColorAt(i, accents.has(i) ? c.set(i % 2 ? 0x8b5cf6 : 0x22d3ee) : c.set(0x14141f));
    }
  }
  laptop.add(keys);

  const pad = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.01, 0.6, 2, 0.004), dark);
  pad.position.set(0, 0.062, 0.62);
  laptop.add(pad);

  // lid hinges at the back edge
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.06, -1.08);
  laptop.add(hinge);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(3.2, 2.1, 0.08, 3, 0.04), shell);
  lid.position.set(0, 1.05, 0);
  hinge.add(lid);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.08, 1.98), dark);
  bezel.position.set(0, 1.05, 0.042);
  hinge.add(bezel);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.96, 1.85),
    new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
  );
  screen.position.set(0, 1.07, 0.044);
  hinge.add(screen);
  // logo glow on the back of the lid
  const logo = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 32),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, toneMapped: false }),
  );
  logo.position.set(0, 1.05, -0.042);
  logo.rotation.y = Math.PI;
  hinge.add(logo);

  // screen light spill onto the keyboard
  const spill = new THREE.PointLight(0x7c5cff, 2.2, 4, 1.5);
  spill.position.set(0, 0.9, 0.2);
  hinge.add(spill);

  laptop.userData.hinge = hinge;
  return laptop;
}

function buildGlyphs() {
  const font = new FontLoader().parse(glyphFont);
  const defs = [
    ['</>', 0x22d3ee],
    ['{ }', 0x8b5cf6],
    ['=>', 0xf472b6],
    ['( )', 0xff6a3d],
    ['[ ]', 0x34d399],
    [';', 0x22d3ee],
    ['#', 0x8b5cf6],
    ['&&', 0xff6a3d],
  ];
  const group = new THREE.Group();
  // Positions relative to the laptop; negative z sits behind it for depth parallax.
  const spots = [
    [-2.9, 1.7, -2], [2.9, 2.0, -2.5], [-2.3, -1.5, -0.6], [3.0, -1.4, 0],
    [0.2, 2.6, -3], [-3.6, -0.1, -3.5], [4.1, 0.3, -3.6], [1.1, -2.3, -1.2],
  ];  defs.forEach(([text, color], i) => {
    const geo = new TextGeometry(text, {
      font,
      size: 0.42,
      depth: 0.14,
      curveSegments: lowPower ? 3 : 5,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    geo.center();
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      metalness: 0.35,
      roughness: 0.18,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...spots[i]);
    mesh.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * 0.8 - 0.4, Math.random() * 0.4 - 0.2);
    mesh.userData = { base: mesh.position.clone(), phase: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.5 };
    group.add(mesh);
  });
  return group;
}

function buildParticles(count) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [new THREE.Color(0x22d3ee), new THREE.Color(0x8b5cf6), new THREE.Color(0xffffff)];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 2] = -Math.random() * 12 + 2;
    const c = palette[i % 3];
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

function initHero({ reducedMotion, onScroll }) {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const stage = createStage(canvas, { fov: 40 });
  const { scene, camera } = stage;

  scene.add(new THREE.HemisphereLight(0xbfb8ff, 0x0a0a14, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x22d3ee, 12, 14);
  rim.position.set(-4, 2, -2);
  scene.add(rim);

  const screen = createCodeScreen();
  const world = new THREE.Group();
  scene.add(world);

  const laptop = buildLaptop(screen.texture);
  const hinge = laptop.userData.hinge;
  // Hinge angle: CLOSED lies the lid flat on the base, OPEN tilts it back ~105°.
  const CLOSED = Math.PI / 2;
  const OPEN = -0.26;
  hinge.rotation.x = reducedMotion ? OPEN : CLOSED;
  world.add(laptop);

  const glyphs = buildGlyphs();
  world.add(glyphs);
  const particles = buildParticles(lowPower ? 350 : 900);
  scene.add(particles);

  // Responsive placement: laptop to the right on desktop, above the text on mobile.
  stage.onResize = (w, h) => {
    const small = w < 860;
    const portrait = h > w;
    camera.position.set(0, small ? 1.2 : 1.1, small ? (portrait ? 13 : 11) : 9.5);
    camera.lookAt(0, small ? 0.6 : 0.2, 0);
    laptop.position.set(small ? 0 : 2.8, small ? 2.1 : 0.2, 0);
    laptop.scale.setScalar(small ? 0.95 : 1);
    // Keep glyphs clustered around the laptop so they never sit on top of the text.
    glyphs.scale.setScalar(small ? 0.62 : 0.85);
    glyphs.position.set(small ? 0 : 3.4, small ? 2.5 : 0.2, 0);
  };
  stage.resize();

  // Pointer parallax (desktop) / gentle drift (touch).
  const pointer = { x: 0, y: 0 };
  if (!isTouch) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true },
    );
  }

  // Scroll progress through the hero drives a parallax dolly.
  let scrollP = 0;
  onScroll((self) => (scrollP = self.progress));

  let intro = reducedMotion ? 1 : 0;
  const tmp = new THREE.Vector3();
  stage.update = (dt, time) => {
    screen.update(dt);
    if (intro < 1) intro = Math.min(1, intro + dt * 0.55);
    const ease = 1 - Math.pow(1 - intro, 3);

    // Lid opens on load, closes slightly as you scroll away.
    hinge.rotation.x = CLOSED + (OPEN - CLOSED) * ease + scrollP * 0.9;

    const px = isTouch ? Math.sin(time * 0.3) * 0.35 : pointer.x;
    const py = isTouch ? Math.cos(time * 0.25) * 0.2 : pointer.y;
    const targetY = -0.45 + px * 0.25 + (reducedMotion ? 0 : Math.sin(time * 0.4) * 0.05);
    laptop.rotation.y += (targetY - laptop.rotation.y) * 0.06;
    laptop.rotation.x += (0.22 + py * 0.08 - laptop.rotation.x) * 0.06;
    if (!reducedMotion) laptop.position.y += Math.sin(time * 1.1) * 0.0015;

    // Each glyph drifts at its own depth → layered parallax.
    glyphs.children.forEach((g) => {
      const { base, phase, spin } = g.userData;
      const depth = 1 + (base.z + 4) * 0.25;
      tmp.copy(base);
      tmp.x += px * 0.35 * depth;
      tmp.y += -py * 0.25 * depth + Math.sin(time * 0.8 + phase) * 0.15 + scrollP * depth * 2.2;
      g.position.lerp(tmp, 0.08);
      g.rotation.y += spin * dt;
      g.rotation.x = Math.sin(time * 0.6 + phase) * 0.25;
    });

    particles.rotation.y = time * 0.02 + px * 0.05;
    particles.position.y = scrollP * 3;
    world.position.y = scrollP * 1.4;
    camera.position.x += (px * 0.4 - camera.position.x) * 0.04;
  };

  stage.renderOnce();
  requestAnimationFrame(() => canvas.classList.add('is-ready'));
}

/* =========================================================
   Model viewers (About → PC, Skills → brain)
   ========================================================= */
function initModelViewer(canvas, url, { size = 2.6, tilt = 0, autoRotate = 1.2, style } = {}) {
  if (!canvas) return;
  const frame = canvas.parentElement;
  whenNear(canvas, () => {
    const stage = createStage(canvas, { fov: 32 });
    const { scene, camera, renderer } = stage;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1530, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const back = new THREE.PointLight(0x8b5cf6, 10, 12);
    back.position.set(-3, 1, -3);
    scene.add(back);

    camera.position.set(0, 0.4, 6.2);
    const pivot = new THREE.Group();
    scene.add(pivot);

    let controls = null;
    if (!isTouch) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false; // never hijack page scroll
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.autoRotate = true;
      controls.autoRotateSpeed = autoRotate;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.7;
    }

    stage.onResize = (w, h) => {
      // Keep the model fully in frame on narrow/portrait containers.
      const fit = h / w > 1 ? h / w : 1;
      camera.position.setLength(6.2 * fit);
    };
    stage.resize();

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const dims = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const holder = new THREE.Group();
        holder.add(model);
        holder.scale.setScalar(size / Math.max(dims.x, dims.y, dims.z));
        holder.rotation.x = tilt;
        style?.(model, pivot);
        pivot.add(holder);
        frame.classList.add('is-loaded');
      },
      undefined,
      (err) => {
        console.warn('Model failed to load', url, err);
        frame.classList.add('is-loaded');
      },
    );

    stage.update = (dt, time) => {
      if (controls) controls.update();
      else pivot.rotation.y += dt * autoRotate * 0.25;
      pivot.position.y = Math.sin(time * 1.2) * 0.06;
      pivot.userData.tick?.(dt, time);
    };
  });
}

// Neural look for the brain: violet glass core + cyan wireframe + orbiting synapses.
function styleBrain(model, pivot) {
  const core = new THREE.MeshStandardMaterial({
    color: 0x6d4aff,
    emissive: 0x2a1580,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.25,
    transparent: true,
    opacity: 0.92,
  });
  const wire = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.12 });
  const extra = [];
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.material = core;
    const w = new THREE.Mesh(o.geometry, wire);
    w.scale.setScalar(1.002);
    extra.push([o, w]);
  });
  extra.forEach(([o, w]) => o.add(w));

  const count = lowPower ? 120 : 260;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 1.7 + Math.random() * 0.6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const synapses = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0x9be7ff, size: 0.035, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  pivot.add(synapses);
  pivot.userData.tick = (dt, time) => {
    synapses.rotation.y -= dt * 0.15;
    synapses.rotation.x = Math.sin(time * 0.3) * 0.2;
    core.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.15;
  };
}

export function initScenes(opts) {
  initHero(opts);
  initModelViewer(document.getElementById('pc-canvas'), '/models/pc.glb', { size: 3, autoRotate: 1 });
  initModelViewer(document.getElementById('brain-canvas'), '/models/brain.glb', {
    size: 2.4,
    autoRotate: 1.6,
    style: styleBrain,
  });
}
