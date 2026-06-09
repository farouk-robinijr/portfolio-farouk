import * as THREE from "../vendor/three.module.js";

const sections = [
  {
    id: "home",
    label: "Home",
    rocketName: "Home Rocket",
    position: new THREE.Vector3(-8.2, 0, 6.9),
    cameraOffset: new THREE.Vector3(4.1, 4.8, 6.0),
    paragraphs: [
      "Welcome to my portfolio. I am a computer science student passionate about Python, SQL, databases, and building creative technology projects. This portfolio is inspired by my dream of building a rocket from scratch.",
    ],
  },
  {
    id: "about",
    label: "About Me",
    rocketName: "About Me Rocket",
    position: new THREE.Vector3(6.8, 0, 6.2),
    cameraOffset: new THREE.Vector3(-4.0, 5.0, 6.4),
    paragraphs: [
      "My name is Farouk El Hammoumi. I am 21 years old and I am from Morocco. I am studying Computer Science as a bachelor student at Valencia College. My main skills are Python and SQL. I want to develop these skills more through internships, freelance work, and real-world experience. My dream is to build a rocket from scratch one day.",
    ],
  },
  {
    id: "projects",
    label: "Projects",
    rocketName: "Projects Rocket",
    position: new THREE.Vector3(-1.8, 0, 0.4),
    cameraOffset: new THREE.Vector3(4.6, 5.2, 6.1),
    intro: "Projects:",
    list: [
      "Casino project created with Python.",
      "SQL database developed for the casino project to store player data and everything related to the casino system.",
      "Database system for merchandise management.",
    ],
  },
  {
    id: "skills",
    label: "Skills",
    rocketName: "Skills Rocket",
    position: new THREE.Vector3(9.0, 0, -2.9),
    cameraOffset: new THREE.Vector3(-4.7, 5.2, 5.8),
    intro: "Skills:",
    list: ["Python", "SQL", "Database design", "Problem solving", "Basic software development"],
  },
  {
    id: "experience",
    label: "Experience",
    rocketName: "Experience Rocket",
    position: new THREE.Vector3(-8.8, 0, -4.5),
    cameraOffset: new THREE.Vector3(4.4, 5.4, 6.2),
    paragraphs: [
      "Experience:",
      "Freelance work for a smoke shop by creating a database for their merchandise. The goal was to organize products, inventory, and store-related data in a better way.",
    ],
  },
  {
    id: "contact",
    label: "Contact",
    rocketName: "Contact Rocket",
    position: new THREE.Vector3(2.4, 0, -8.1),
    cameraOffset: new THREE.Vector3(4.3, 5.5, 5.9),
    contact: [
      { label: "Email", value: "farouklheh@gmail.com", href: "mailto:farouklheh@gmail.com" },
      { label: "Instagram", value: "farouk.3e" },
      { label: "LinkedIn", value: "Farouk EL Hammoumi" },
    ],
  },
];

const byId = new Map(sections.map((section) => [section.id, section]));
const refs = new Map();
const hitTargets = [];
const vehicles = [];
const beacons = [];
const scanners = [];
const galaxyLayers = [];

const canvas = document.querySelector("#scene-canvas");
const panel = document.querySelector("#section-panel");
const panelKicker = document.querySelector("#panel-kicker");
const panelTitle = document.querySelector("#panel-title");
const panelContent = document.querySelector("#panel-content");
const closeButton = document.querySelector("#close-panel");
const loading = document.querySelector("#loading");
const dockButtons = Array.from(document.querySelectorAll(".dock-button"));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x01030a);
scene.fog = new THREE.FogExp2(0x050911, 0.014);

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 220);
const baseCameraPosition = new THREE.Vector3(0, 11.2, 22.4);
const baseLookAt = new THREE.Vector3(-0.4, 1.1, -1.6);
const targetCameraPosition = baseCameraPosition.clone();
const targetLookAt = baseLookAt.clone();
const currentLookAt = baseLookAt.clone();
camera.position.copy(baseCameraPosition);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const scratch = new THREE.Vector3();
const lookScratch = new THREE.Vector3();
const sideScratch = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
const lookObject = new THREE.Object3D();

const softShadowTexture = createSoftDiscTexture();
const exhaustTexture = createExhaustTexture();
const steamTexture = createSteamTexture();

const materials = {
  base: standard(0x18181d, 0.18, 0.86),
  road: standard(0x202025, 0.18, 0.78),
  bevel: standard(0x25252b, 0.24, 0.7),
  black: standard(0x101014, 0.2, 0.78),
  tower: standard(0x15151a, 0.36, 0.7),
  white: standard(0xfffdf3, 0.05, 0.28),
  glass: new THREE.MeshStandardMaterial({
    color: 0x101824,
    emissive: 0x14314f,
    emissiveIntensity: 0.26,
    metalness: 0.05,
    roughness: 0.18,
    transparent: true,
    opacity: 0.74,
  }),
  rocketBlack: standard(0x050506, 0.18, 0.46),
  red: new THREE.MeshStandardMaterial({
    color: 0xef1b25,
    emissive: 0xff1722,
    emissiveIntensity: 1.3,
    metalness: 0.24,
    roughness: 0.42,
  }),
  redLight: new THREE.MeshBasicMaterial({ color: 0xff4a4a }),
  redGlow: new THREE.MeshBasicMaterial({
    color: 0xff3a3a,
    transparent: true,
    opacity: 0.26,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  blueGlow: new THREE.MeshBasicMaterial({
    color: 0x61a8ff,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
  hitbox: new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0, depthWrite: false }),
};

let hoveredId = null;
let selectedId = null;
let panelTimer = null;

init();
animate();

function standard(color, metalness, roughness) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

function init() {
  addBackground();
  addLights();
  addBase();
  addRoads();
  addBuildings();
  addLifeLayer();

  sections.forEach((section, index) => scene.add(createLaunchPad(section, index)));

  bindEvents();
  setTimeout(() => loading.classList.add("hidden"), 550);
}

function addLights() {
  scene.add(new THREE.AmbientLight(0xb6b0a8, 0.28));
  scene.add(new THREE.HemisphereLight(0x31415a, 0x120909, 0.72));

  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-10, 18, 13);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 60;
  key.shadow.camera.left = -24;
  key.shadow.camera.right = 24;
  key.shadow.camera.top = 24;
  key.shadow.camera.bottom = -24;
  key.shadow.bias = -0.0001;
  key.shadow.normalBias = 0.035;
  scene.add(key);

  const coolRim = new THREE.DirectionalLight(0x87bfff, 1.1);
  coolRim.position.set(-11, 7, -14);
  scene.add(coolRim);

  const redWash = new THREE.PointLight(0xff2525, 2.7, 38, 1.65);
  redWash.position.set(0, 3.7, 1.2);
  scene.add(redWash);
}

function addBackground() {
  const galaxy = new THREE.Mesh(
    new THREE.PlaneGeometry(118, 66),
    new THREE.MeshBasicMaterial({ map: createGalaxyTexture(), fog: false, depthWrite: false }),
  );
  galaxy.position.set(0, 23, -70);
  scene.add(galaxy);
  galaxyLayers.push({ object: galaxy, speed: 0.00035, drift: 0.035 });

  const positions = new Float32Array(1800 * 3);
  const colors = new Float32Array(1800 * 3);
  for (let i = 0; i < 1800; i += 1) {
    const radius = THREE.MathUtils.randFloat(38, 88);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = THREE.MathUtils.randFloat(12, 54);
    positions[i * 3 + 2] = Math.sin(theta) * radius - 10;
    const blue = Math.random() > 0.7;
    colors[i * 3] = blue ? 0.55 : 1;
    colors[i * 3 + 1] = blue ? 0.75 : 0.95;
    colors[i * 3 + 2] = 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ size: 0.07, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.78, fog: false }),
  );
  scene.add(stars);
  galaxyLayers.push({ object: stars, speed: 0.0016, drift: 0.025 });
}

function createGalaxyTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 2048;
  canvasTexture.height = 1024;
  const ctx = canvasTexture.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvasTexture.width, canvasTexture.height);
  gradient.addColorStop(0, "#020409");
  gradient.addColorStop(0.35, "#06101f");
  gradient.addColorStop(0.65, "#08172b");
  gradient.addColorStop(1, "#010307");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasTexture.width, canvasTexture.height);
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < 300; i += 1) {
    const x = 260 + Math.random() * 1500;
    const y = 720 - (x / 2048) * 420 + (Math.random() - 0.5) * 160;
    const r = 35 + Math.random() * 130;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(80, 145, 255, 0.14)");
    g.addColorStop(0.42, "rgba(38, 90, 180, 0.06)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 2.1, r * 0.22, -0.52, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 1700; i += 1) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const s = Math.random() > 0.965 ? 2.6 : 0.75 + Math.random() * 1.2;
    ctx.fillStyle = Math.random() > 0.76 ? "rgba(146,190,255,0.82)" : "rgba(255,255,255,0.72)";
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPlanet(ctx, -50, 1065, 430, "rgba(96,170,255,0.95)", true);
  drawPlanet(ctx, 1898, 190, 105, "rgba(78,150,255,0.82)", false);
  drawPlanet(ctx, 1943, 310, 22, "rgba(136,175,230,0.54)", false);
  drawPlanet(ctx, 525, 889, 48, "rgba(130,178,240,0.58)", false);

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawPlanet(ctx, x, y, radius, rimColor, cityLights) {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  const atmosphere = ctx.createRadialGradient(x + radius * 0.18, y - radius * 0.18, radius * 0.66, x, y, radius * 1.2);
  atmosphere.addColorStop(0, "rgba(0,0,0,0)");
  atmosphere.addColorStop(0.78, "rgba(0,0,0,0)");
  atmosphere.addColorStop(0.9, rimColor);
  atmosphere.addColorStop(1, "rgba(42,112,255,0)");
  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.2, 0, Math.PI * 2);
  ctx.fill();
  const body = ctx.createRadialGradient(x + radius * 0.32, y - radius * 0.28, radius * 0.1, x, y, radius);
  body.addColorStop(0, "#08172a");
  body.addColorStop(0.44, "#020407");
  body.addColorStop(1, "#000000");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = Math.max(2, radius * 0.018);
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.006, -Math.PI * 0.08, Math.PI * 1.18);
  ctx.stroke();
  if (cityLights) {
    for (let i = 0; i < 90; i += 1) {
      const angle = -2.1 + Math.random() * 1.05;
      const distance = radius * (0.25 + Math.random() * 0.6);
      ctx.fillStyle = "rgba(255,150,72,0.62)";
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * distance + Math.random() * 48, y + Math.sin(angle) * distance + Math.random() * 70, 1.2 + Math.random() * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function addBase() {
  const deck = new THREE.Mesh(new THREE.BoxGeometry(31, 0.32, 28), materials.base);
  deck.position.set(0, -0.2, -0.6);
  deck.receiveShadow = true;
  scene.add(deck);

  addBox(31.5, 0.18, 0.26, 0, 0.03, 13.4, materials.bevel);
  addBox(31.5, 0.18, 0.26, 0, 0.03, -14.6, materials.bevel);
  addBox(0.26, 0.18, 28.4, -15.6, 0.03, -0.6, materials.bevel);
  addBox(0.26, 0.18, 28.4, 15.6, 0.03, -0.6, materials.bevel);

  for (let x = -13; x <= 13; x += 3.25) addBox(0.018, 0.012, 26, x, 0.01, -0.6, materials.bevel);
  for (let z = -12.5; z <= 11.5; z += 3.1) addBox(29, 0.012, 0.018, 0, 0.012, z, materials.bevel);
  for (let x = -13.4; x <= 13.4; x += 3.2) {
    addGlowDash(x, 0.12, 12.6, 0);
    addGlowDash(x, 0.12, -13.8, 0);
  }
}

function addRoads() {
  const center = new THREE.Vector3(-1.8, 0, 0.4);
  sections.forEach((section) => {
    if (section.id !== "projects") scene.add(createRoad(center, section.position, 1.06));
  });
  scene.add(createRoad(new THREE.Vector3(-14, 0, 10.8), new THREE.Vector3(14, 0, 9.6), 0.84));
  scene.add(createRoad(new THREE.Vector3(-13.2, 0, -10.8), new THREE.Vector3(13.5, 0, -12.3), 0.72));
}

function createRoad(from, to, width) {
  const group = new THREE.Group();
  const delta = to.clone().sub(from);
  const length = Math.max(delta.length() - 3.2, 0.1);
  group.position.copy(from.clone().add(to).multiplyScalar(0.5));
  group.position.y = 0.01;
  group.rotation.y = Math.atan2(delta.x, delta.z);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(width, 0.045, length), materials.road);
  slab.receiveShadow = true;
  group.add(slab);
  for (let i = 0; i < Math.max(Math.floor(length / 1.5), 2); i += 1) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.028, 0.5), materials.redLight);
    dash.position.set(0, 0.07, -length / 2 + 0.7 + i * 1.45);
    group.add(dash);
  }
  return group;
}

function addBuildings() {
  [
    [-12.4, 0.5, 0.8, 2.6, 1.1, 4.6],
    [12.1, 0.6, 1.9, 2.9, 1.2, 4.1],
    [-3.4, 0.45, 9.9, 4.2, 0.9, 1.7],
    [4.6, 0.42, -12.3, 4.8, 0.84, 1.6],
    [-12.6, 0.55, -10.4, 2.2, 1.1, 2.8],
  ].forEach(([x, y, z, sx, sy, sz]) => {
    const building = addBox(sx, sy, sz, x, y, z, materials.black);
    building.receiveShadow = true;
    for (let i = 0; i < Math.floor(sx); i += 1) addGlowDash(x - sx / 2 + 0.5 + i * 0.8, y + sy * 0.12, z + sz / 2 + 0.03, 0);
  });
}

function createLaunchPad(section, index) {
  const group = new THREE.Group();
  group.position.copy(section.position);

  const lower = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.64, 0.46, 96), materials.black);
  lower.position.y = 0.16;
  lower.castShadow = true;
  lower.receiveShadow = true;
  group.add(lower);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.12, 2.24, 0.16, 96), materials.base);
  top.position.y = 0.47;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const outerRing = ring(2.22, 0.035, 0.18);
  outerRing.position.y = 0.59;
  group.add(outerRing);
  const innerRing = ring(1.2, 0.022, 0.14);
  innerRing.position.y = 0.61;
  group.add(innerRing);

  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.08), materials.redLight);
    dash.position.set(Math.cos(angle) * 1.78, 0.64, Math.sin(angle) * 1.78);
    dash.rotation.y = -angle;
    group.add(dash);
  }

  const shadow = contactShadow(3.45, 2.55, 0.42);
  shadow.position.y = 0.665;
  group.add(shadow);

  const rocket = createRocket(section.id);
  rocket.position.y = 0.58;
  group.add(rocket);

  const slide = createSlide(section, index);
  slide.group.position.set((index % 2 === 0 ? 1 : -1) * 2.72, 2.34, 1.28);
  group.add(slide.group);

  const exhaust = createExhaust();
  exhaust.group.position.set(0, 0.62, 0);
  group.add(exhaust.group);

  const tower = createTower(index);
  tower.position.set(index % 2 === 0 ? -2.6 : 2.6, 0.25, index % 3 === 0 ? -0.2 : 0.25);
  group.add(tower);

  const padLight = new THREE.PointLight(0xff2b2b, 0.5, 7, 1.8);
  padLight.position.set(0, 1.25, 0);
  group.add(padLight);

  const activeHalo = ring(2.55, 0.055, 0);
  activeHalo.position.y = 0.73;
  group.add(activeHalo);

  refs.set(section.id, { group, rocket, slide, exhaust, padLight, outerRing, innerRing, activeHalo, phase: index * 0.72 });
  return group;
}

function createRocket(sectionId) {
  const group = new THREE.Group();
  group.userData.sectionId = sectionId;
  addInteractive(new THREE.CylinderGeometry(0.35, 0.35, 3.25, 48), materials.white, sectionId, group, 0, 2.0, 0);
  addInteractive(new THREE.ConeGeometry(0.36, 0.9, 48), materials.white, sectionId, group, 0, 4.05, 0);
  addInteractive(new THREE.CylinderGeometry(0.356, 0.356, 0.22, 48), materials.rocketBlack, sectionId, group, 0, 2.92, 0);
  addInteractive(new THREE.CylinderGeometry(0.357, 0.357, 0.08, 48), materials.red, sectionId, group, 0, 1.12, 0);
  const nozzle = addInteractive(new THREE.ConeGeometry(0.32, 0.48, 32), materials.rocketBlack, sectionId, group, 0, 0.18, 0);
  nozzle.rotation.x = Math.PI;
  [[-0.56, 0], [0.56, 0], [0, -0.56]].forEach(([x, z]) => {
    const booster = new THREE.Group();
    addInteractive(new THREE.CylinderGeometry(0.15, 0.15, 2.08, 30), materials.white, sectionId, booster, 0, 0, 0);
    addInteractive(new THREE.ConeGeometry(0.155, 0.38, 30), materials.white, sectionId, booster, 0, 1.23, 0);
    const foot = addInteractive(new THREE.ConeGeometry(0.14, 0.28, 24), materials.rocketBlack, sectionId, booster, 0, -1.2, 0);
    foot.rotation.x = Math.PI;
    addInteractive(new THREE.CylinderGeometry(0.153, 0.153, 0.05, 30), materials.red, sectionId, booster, 0, 0.42, 0);
    booster.position.set(x, 1.55, z);
    group.add(booster);
  });
  [[0.43, 0, 0.14, 0.76, 0.32], [-0.43, 0, 0.14, 0.76, 0.32], [0, 0.43, 0.32, 0.76, 0.14], [0, -0.43, 0.32, 0.76, 0.14]].forEach(([x, z, sx, sy, sz]) => {
    const fin = addInteractive(new THREE.BoxGeometry(sx, sy, sz), materials.rocketBlack, sectionId, group, x, 0.72, z);
    fin.castShadow = true;
  });
  const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.34, 5.75, 18), materials.hitbox);
  hitbox.position.y = 2.52;
  hitbox.userData.sectionId = sectionId;
  hitTargets.push(hitbox);
  group.add(hitbox);
  return group;
}

function createSlide(section, index) {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.62, 1.62, 0.1), materials.black.clone());
  frame.material.emissive = new THREE.Color(0x350404);
  frame.material.emissiveIntensity = 0.42;
  frame.position.z = -0.045;
  frame.castShadow = true;
  group.add(frame);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 1.36), new THREE.MeshBasicMaterial({ map: createSlideTexture(section), transparent: true, opacity: 0.92 }));
  screen.position.z = 0.02;
  group.add(screen);
  const redLine = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.035, 0.04), materials.redLight);
  redLine.position.set(0, -0.61, 0.06);
  group.add(redLine);
  const glow = new THREE.PointLight(0xff3030, 0.58, 4.6, 2);
  glow.position.set(0, 0.2, 0.5);
  group.add(glow);
  const hitbox = new THREE.Mesh(new THREE.BoxGeometry(2.82, 1.82, 0.28), materials.hitbox);
  hitbox.position.z = 0.08;
  hitbox.userData.sectionId = section.id;
  hitTargets.push(hitbox);
  group.add(hitbox);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.42, 10), materials.tower);
  post.position.set(0, -1.06, -0.04);
  post.castShadow = true;
  group.add(post);
  group.rotation.y = index % 2 === 0 ? -0.55 : 0.55;
  return { group, screen, frame, glow, redLine };
}

function createSlideTexture(section) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 456;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, c.width, c.height);
  g.addColorStop(0, "#111115");
  g.addColorStop(0.5, "#060608");
  g.addColorStop(1, "#170607");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "rgba(255, 74, 74, 0.84)";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, c.width - 36, c.height - 36);
  ctx.fillStyle = "rgba(255, 74, 74, 0.95)";
  ctx.fillRect(44, 70, 92, 7);
  ctx.fillStyle = "rgba(178,176,173,0.92)";
  ctx.font = "700 24px Arial, sans-serif";
  ctx.fillText("PORTFOLIO PAD", 52, 58);
  ctx.fillStyle = "#f7f6ef";
  ctx.font = "800 58px Arial, sans-serif";
  ctx.fillText(section.label.toUpperCase(), 52, 145);
  ctx.fillStyle = "rgba(255,74,74,0.9)";
  ctx.font = "700 24px Arial, sans-serif";
  ctx.fillText(section.rocketName, 52, 188);
  ctx.fillStyle = "rgba(247,246,239,0.82)";
  ctx.font = "500 28px Arial, sans-serif";
  wrapText(ctx, previewText(section), 52, 248, c.width - 104, 36, 3);
  ctx.fillStyle = "rgba(255,74,74,0.78)";
  ctx.font = "800 20px Arial, sans-serif";
  ctx.fillText("CLICK TO OPEN", 52, c.height - 50);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function previewText(section) {
  if (section.contact) return "Email, Instagram, and LinkedIn connection details.";
  if (section.list) return section.list.slice(0, 2).join(" ");
  return section.paragraphs?.join(" ") ?? "";
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines += 1;
      if (lines >= maxLines) {
        ctx.fillText(`${line.replace(/[.,;:]?$/, "")}...`, x, y);
        return;
      }
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

function createTower(index) {
  const group = new THREE.Group();
  const height = 4.5;
  [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([x, z]) => {
    group.add(beam(new THREE.Vector3(x, 0, z), new THREE.Vector3(x, height, z), 0.045, materials.tower));
  });
  for (let y = 0.75; y < height - 0.35; y += 0.72) {
    group.add(beam(new THREE.Vector3(-0.32, y, -0.32), new THREE.Vector3(0.32, y + 0.42, -0.32), 0.026, materials.tower));
    group.add(beam(new THREE.Vector3(0.32, y, 0.32), new THREE.Vector3(-0.32, y + 0.42, 0.32), 0.026, materials.tower));
  }
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.95), materials.black);
  deck.position.y = height;
  deck.castShadow = true;
  group.add(deck);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 10), materials.redLight);
  beacon.position.y = height + 0.18;
  group.add(beacon);
  const light = new THREE.PointLight(0xff2424, 0.75, 5.8, 2.2);
  light.position.y = height + 0.2;
  group.add(light);
  beacons.push({ bulb: beacon, light, phase: index * 0.55 });
  return group;
}

function addLifeLayer() {
  const routeA = curve([
    [-13.2, 0.34, 10.8], [-6.4, 0.34, 10.9], [-1.7, 0.34, 6.1], [4.8, 0.34, 8.6],
    [12.7, 0.34, 8.3], [11.8, 0.34, -2.4], [9.4, 0.34, -11.4], [-1.2, 0.34, -12.0],
    [-12.6, 0.34, -10.6], [-13.8, 0.34, -0.8],
  ]);
  const routeB = curve([
    [12.2, 0.36, -11.8], [6.8, 0.36, -9.4], [2.5, 0.36, -6.8], [-1.8, 0.36, 0.4],
    [-6.8, 0.36, 4.9], [-9.2, 0.36, 7.2], [-13.0, 0.36, 9.5], [-8.6, 0.36, 11.2],
    [1.6, 0.36, 10.0], [9.8, 0.36, 6.1],
  ]);
  const roverA = createRover(0xff3535);
  const roverB = createRover(0xfff4e8);
  scene.add(roverA, roverB);
  vehicles.push(vehicleAI(roverA, routeA, 0.036, 0.18, 0.24));
  vehicles.push(vehicleAI(roverB, routeB, 0.03, 0.27, -0.22));
  scanners.push(createScanner(new THREE.Vector3(-11.8, 2.9, 2.8), 8.2, 0.24, 0.34));
  scanners.push(createScanner(new THREE.Vector3(12.2, 3.1, -7.8), 9.4, -0.18, -0.28));
  scanners.forEach((scanner) => scene.add(scanner.group));
}

function curve(points) {
  return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), true, "centripetal", 0.45);
}

function vehicleAI(group, route, speed, progress, laneOffset) {
  return { group, route, speed, targetSpeed: speed, progress, laneOffset, steer: 0, lastPosition: group.position.clone() };
}

function lanePoint(vehicle, progress, target) {
  const p = vehicle.route.getPointAt(((progress % 1) + 1) % 1);
  const tangent = vehicle.route.getTangentAt(((progress % 1) + 1) % 1).normalize();
  sideScratch.crossVectors(up, tangent).normalize().multiplyScalar(vehicle.laneOffset);
  return target.copy(p).add(sideScratch);
}

function createRover(accentColor) {
  const group = new THREE.Group();
  group.scale.setScalar(1.12);
  const bodyMat = standard(0x0c0d11, 0.34, 0.52);
  const tireMat = standard(0x030304, 0.08, 0.86);
  const body = addChildBox(group, 1.3, 0.34, 1.86, 0, 0.42, 0, bodyMat);
  body.receiveShadow = true;
  addChildBox(group, 1.02, 0.26, 0.6, 0, 0.45, -0.98, materials.bevel);
  addChildBox(group, 0.92, 0.34, 0.76, 0, 0.74, -0.28, materials.glass);
  addChildBox(group, 1.16, 0.22, 0.64, 0, 0.66, 0.7, materials.bevel);
  const frontBar = addChildBox(group, 1.22, 0.075, 0.08, 0, 0.6, -1.31, materials.redLight.clone());
  frontBar.material.color.setHex(accentColor);
  const head = addChildBox(group, 0.7, 0.07, 0.035, 0, 0.48, -1.34, materials.blueGlow.clone());
  head.material.opacity = 0.95;
  const rearGlow = addChildBox(group, 0.42, 0.12, 0.04, 0, 0.54, 1.1, materials.redGlow.clone());
  rearGlow.material.opacity = 0.7;
  const underglow = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.8), materials.redGlow.clone());
  underglow.material.opacity = 0.28;
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.08;
  group.add(underglow);
  const wheels = [];
  const frontWheels = [];
  [[-0.78, 0.3, -0.78, true], [0.78, 0.3, -0.78, true], [-0.8, 0.3, 0.74, false], [0.8, 0.3, 0.74, false]].forEach(([x, y, z, front]) => {
    const steering = new THREE.Group();
    steering.position.set(x, y, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.24, 28), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    tire.receiveShadow = true;
    steering.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.255, 18), materials.bevel);
    hub.rotation.z = Math.PI / 2;
    steering.add(hub);
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 8, 30), materials.redGlow.clone());
    ringMesh.material.opacity = 0.5;
    ringMesh.rotation.y = Math.PI / 2;
    steering.add(ringMesh);
    group.add(steering);
    wheels.push(tire, hub, ringMesh);
    if (front) frontWheels.push(steering);
  });
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 10), materials.redLight.clone());
  beacon.position.set(0, 1.15, 0.18);
  group.add(beacon);
  const beaconLight = new THREE.PointLight(accentColor, 1.3, 4.4, 2);
  beaconLight.position.set(0, 1.12, 0.16);
  group.add(beaconLight);
  const shadow = contactShadow(2.08, 2.3, 0.46);
  shadow.position.y = 0.02;
  group.add(shadow);
  group.userData = { wheels, frontWheels, beacon, beaconLight, rearGlow, underglow, wheelRadius: 0.31, currentSpeed: 0, lastPosition: new THREE.Vector3() };
  return group;
}

function createScanner(position, length, yaw, speed) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = yaw;
  group.add(addChildBox(new THREE.Group(), 0.42, 0.22, 0.26, 0, 0, 0, materials.black));
  const beamMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.82, length, 32, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xff3030, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  beamMesh.rotation.x = Math.PI / 2;
  beamMesh.position.z = -length / 2;
  group.add(beamMesh);
  return { group, beam: beamMesh, speed, phase: yaw };
}

function createExhaust() {
  const group = new THREE.Group();
  const core = sprite(exhaustTexture, 0xfff2f2, 0.2, 0.58, 1.45);
  const wide = sprite(exhaustTexture, 0xff3030, 0.1, 1.1, 1.95);
  wide.position.y = -0.2;
  group.add(core, wide);
  const glow = new THREE.Mesh(new THREE.CircleGeometry(0.8, 48), materials.redGlow.clone());
  glow.material.opacity = 0.08;
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.08;
  group.add(glow);
  const light = new THREE.PointLight(0xff2222, 0.18, 4.2, 2);
  group.add(light);
  const puffs = [];
  for (let i = 0; i < 6; i += 1) {
    const puff = sprite(steamTexture, 0xd9d9d9, 0.04, 0.34, 0.34);
    puff.userData = { angle: (i / 6) * Math.PI * 2, radius: 0.34 + (i % 3) * 0.16, speed: 0.14 + i * 0.018, phase: i / 6 };
    group.add(puff);
    puffs.push(puff);
  }
  return { group, core, wide, glow, light, puffs };
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  camera.position.lerp(targetCameraPosition, 1 - Math.exp(-1.65 * delta));
  currentLookAt.lerp(targetLookAt, 1 - Math.exp(-1.9 * delta));
  camera.lookAt(currentLookAt);

  galaxyLayers.forEach((layer) => {
    layer.object.rotation.z += delta * layer.speed;
    layer.object.position.x += Math.sin(elapsed * 0.045 + layer.speed * 1000) * layer.drift * delta;
  });
  animateVehicles(elapsed, delta);
  scanners.forEach((scanner, i) => {
    scanner.group.rotation.y = scanner.phase + elapsed * scanner.speed;
    scanner.beam.material.opacity = 0.11 + (0.5 + Math.sin(elapsed * 2.4 + i) * 0.5) * 0.14;
  });
  beacons.forEach((beacon) => {
    const pulse = Math.max(0, Math.sin(elapsed * 4.4 + beacon.phase));
    beacon.light.intensity = 0.4 + pulse * 2.2;
    beacon.bulb.scale.setScalar(0.9 + pulse * 0.45);
  });

  refs.forEach((ref, id) => {
    const isActive = selectedId === id;
    const isHovered = hoveredId === id;
    const thrust = isActive ? 1 : isHovered ? 0.62 : 0.28;
    const bob = isActive ? 0.12 : isHovered ? 0.08 : 0.045;
    const lift = isActive ? 0.16 : isHovered ? 0.08 : 0.02;
    const flicker = 0.5 + Math.sin(elapsed * 13.2 + ref.phase * 2.1) * 0.5;
    ref.rocket.position.y = 0.58 + lift + Math.sin(elapsed * 1.55 + ref.phase) * bob;
    ref.rocket.rotation.y = Math.sin(elapsed * 0.52 + ref.phase) * (isActive ? 0.07 : 0.04);
    ref.rocket.rotation.x = Math.sin(elapsed * 0.82 + ref.phase) * (isActive ? 0.018 : 0.01);
    ref.padLight.intensity = THREE.MathUtils.damp(ref.padLight.intensity, isActive ? 3.45 : isHovered ? 2.15 : 0.48, 5.5, delta);
    dampOpacity(ref.outerRing.material, isActive ? 0.78 : isHovered ? 0.54 : 0.2, delta);
    dampOpacity(ref.innerRing.material, isActive ? 0.46 : isHovered ? 0.34 : 0.16, delta);
    dampOpacity(ref.activeHalo.material, isActive ? 0.52 : isHovered ? 0.28 : 0, delta);
    animateExhaust(ref.exhaust, thrust, flicker, elapsed, delta, ref.phase);
    animateSlide(ref.slide, isActive, isHovered, elapsed, delta, ref.phase);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function animateVehicles(elapsed, delta) {
  vehicles.forEach((vehicle, index) => {
    const tangent = vehicle.route.getTangentAt(vehicle.progress).normalize();
    const future = vehicle.route.getTangentAt((vehicle.progress + 0.035) % 1).normalize();
    const corner = tangent.angleTo(future);
    let desired = vehicle.speed * THREE.MathUtils.clamp(1.08 - corner * 2.1, 0.48, 1.08);
    vehicles.forEach((other) => {
      if (other !== vehicle) {
        const distance = vehicle.group.position.distanceTo(other.group.position);
        if (distance < 2.2) desired *= THREE.MathUtils.mapLinear(distance, 0.8, 2.2, 0.25, 0.86);
      }
    });
    vehicle.group.userData.currentSpeed = THREE.MathUtils.damp(vehicle.group.userData.currentSpeed, desired, 1.8, delta);
    vehicle.progress = (vehicle.progress + vehicle.group.userData.currentSpeed * delta) % 1;
    lanePoint(vehicle, vehicle.progress, scratch);
    lanePoint(vehicle, vehicle.progress + 0.018, lookScratch);
    vehicle.group.position.copy(scratch);
    vehicle.group.position.y += Math.sin(elapsed * 7.5 + index) * 0.018;
    lookObject.position.copy(scratch);
    lookObject.lookAt(lookScratch);
    vehicle.group.quaternion.slerp(lookObject.quaternion, 1 - Math.exp(-7.5 * delta));
    const moved = scratch.distanceTo(vehicle.group.userData.lastPosition);
    vehicle.group.userData.lastPosition.copy(scratch);
    vehicle.group.userData.wheels.forEach((wheel) => {
      wheel.rotation.y -= moved / vehicle.group.userData.wheelRadius;
    });
    const steer = Math.sign(tangent.clone().cross(future).y || 0) * THREE.MathUtils.clamp(corner * 2.6, 0, 0.48);
    vehicle.steer = THREE.MathUtils.damp(vehicle.steer, steer, 7, delta);
    vehicle.group.userData.frontWheels.forEach((wheelGroup) => {
      wheelGroup.rotation.y = vehicle.steer;
    });
    const pulse = 0.45 + Math.sin(elapsed * 8.5 + index) * 0.35;
    vehicle.group.userData.beaconLight.intensity = 0.95 + pulse;
    vehicle.group.userData.beacon.scale.setScalar(1 + pulse * 0.5);
    vehicle.group.userData.rearGlow.material.opacity = 0.38 + (vehicle.group.userData.currentSpeed / vehicle.speed) * 0.32;
    vehicle.group.userData.underglow.material.opacity = 0.18 + pulse * 0.18;
  });
}

function animateSlide(slide, isActive, isHovered, elapsed, delta, phase) {
  slide.group.getWorldPosition(scratch);
  lookScratch.set(camera.position.x, scratch.y, camera.position.z);
  slide.group.lookAt(lookScratch);
  slide.group.position.y = 2.34 + Math.sin(elapsed * 1.2 + phase + 1.8) * (isActive ? 0.08 : isHovered ? 0.05 : 0.025);
  const scale = isActive ? 1.08 : isHovered ? 1.04 : 1;
  slide.group.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.exp(-6 * delta));
  slide.glow.intensity = THREE.MathUtils.damp(slide.glow.intensity, isActive ? 1.8 : isHovered ? 1.05 : 0.48, 7, delta);
  slide.screen.material.opacity = THREE.MathUtils.damp(slide.screen.material.opacity, isActive ? 1 : isHovered ? 0.98 : 0.9, 7, delta);
  slide.redLine.scale.x = 1 + Math.sin(elapsed * 3 + phase) * (isActive ? 0.08 : 0.03);
}

function animateExhaust(exhaust, thrust, flicker, elapsed, delta, phase) {
  exhaust.core.material.opacity = THREE.MathUtils.damp(exhaust.core.material.opacity, 0.08 + thrust * 0.3 + flicker * 0.08, 9, delta);
  exhaust.wide.material.opacity = THREE.MathUtils.damp(exhaust.wide.material.opacity, 0.04 + thrust * 0.18 + flicker * 0.05, 9, delta);
  exhaust.glow.material.opacity = THREE.MathUtils.damp(exhaust.glow.material.opacity, 0.05 + thrust * 0.18 + flicker * 0.04, 9, delta);
  exhaust.light.intensity = THREE.MathUtils.damp(exhaust.light.intensity, 0.22 + thrust * 1.15, 8, delta);
  exhaust.core.scale.set(0.42 + thrust * 0.24 + flicker * 0.08, 1.05 + thrust * 0.9 + flicker * 0.28, 1);
  exhaust.wide.scale.set(0.86 + thrust * 0.32 + flicker * 0.12, 1.55 + thrust * 1.1 + flicker * 0.34, 1);
  exhaust.puffs.forEach((puff) => {
    const cycle = (elapsed * puff.userData.speed + puff.userData.phase + phase * 0.08) % 1;
    const angle = puff.userData.angle + elapsed * 0.18;
    const radius = puff.userData.radius + cycle * (0.72 + thrust * 0.28);
    puff.position.set(Math.cos(angle) * radius, -0.1 + cycle * 0.34, Math.sin(angle) * radius);
    puff.scale.setScalar((0.22 + cycle * 0.62) * (0.88 + thrust * 0.3));
    puff.material.opacity = (0.025 + thrust * 0.09) * Math.sin(cycle * Math.PI);
  });
}

function bindEvents() {
  window.addEventListener("resize", onResize);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", (event) => {
    const id = getIdFromPointer(event);
    if (id) selectSection(id);
  });
  canvas.addEventListener("pointerleave", () => setHovered(null));
  closeButton.addEventListener("click", returnToBase);
  dockButtons.forEach((button) => {
    button.addEventListener("click", () => selectSection(button.dataset.section));
    button.addEventListener("mouseenter", () => setHovered(button.dataset.section));
    button.addEventListener("mouseleave", () => setHovered(null));
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  const id = getIdFromPointer(event);
  setHovered(id);
  canvas.style.cursor = id ? "pointer" : "default";
}

function getIdFromPointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(hitTargets, false)[0]?.object.userData.sectionId ?? null;
}

function setHovered(id) {
  if (hoveredId === id) return;
  hoveredId = id;
}

function selectSection(id) {
  const section = byId.get(id);
  if (!section) return;
  selectedId = id;
  document.body.classList.add("panel-open");
  panel.classList.remove("visible");
  panel.setAttribute("aria-hidden", "true");
  clearTimeout(panelTimer);
  updatePanel(section);
  updateDockButtons();
  targetLookAt.copy(section.position).add(new THREE.Vector3(0, 2.25, 0));
  targetCameraPosition.copy(section.position).add(section.cameraOffset);
  const delay = camera.position.distanceTo(targetCameraPosition) > 12 ? 920 : 520;
  panelTimer = setTimeout(() => {
    panel.classList.add("visible");
    panel.setAttribute("aria-hidden", "false");
  }, delay);
}

function returnToBase() {
  selectedId = null;
  document.body.classList.remove("panel-open");
  clearTimeout(panelTimer);
  panel.classList.remove("visible");
  panel.setAttribute("aria-hidden", "true");
  targetCameraPosition.copy(baseCameraPosition);
  targetLookAt.copy(baseLookAt);
  updateDockButtons();
}

function updatePanel(section) {
  panelKicker.textContent = `${section.label} Section`;
  panelTitle.textContent = section.rocketName;
  panelContent.replaceChildren();
  if (section.intro) panelContent.append(paragraph(section.intro));
  section.paragraphs?.forEach((text) => panelContent.append(paragraph(text)));
  if (section.list) {
    const list = document.createElement("ul");
    section.list.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      list.append(item);
    });
    panelContent.append(list);
  }
  if (section.contact) {
    panelContent.append(paragraph("Contact:"));
    const list = document.createElement("div");
    list.className = "contact-list";
    section.contact.forEach((item) => {
      const row = item.href ? document.createElement("a") : document.createElement("span");
      row.textContent = `${item.label}: ${item.value}`;
      if (item.href) row.href = item.href;
      list.append(row);
    });
    panelContent.append(list);
  }
}

function paragraph(text) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}

function updateDockButtons() {
  dockButtons.forEach((button) => button.classList.toggle("active", button.dataset.section === (selectedId ?? "home")));
}

function addInteractive(geometry, material, sectionId, parent, x, y, z) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData.sectionId = sectionId;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addBox(sx, sy, sz, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function addChildBox(parent, sx, sy, sz, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addGlowDash(x, y, z, rotationY) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.035, 0.08), materials.redLight);
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotationY;
  scene.add(mesh);
  return mesh;
}

function ring(radius, tube, opacity) {
  const material = materials.redGlow.clone();
  material.opacity = opacity;
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 96), material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function contactShadow(width, depth, opacity) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ map: softShadowTexture, color: 0x000000, transparent: true, opacity, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function beam(start, end, radius, material) {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  return mesh;
}

function sprite(texture, color, opacity, sx, sy) {
  const spriteMesh = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
  spriteMesh.scale.set(sx, sy, 1);
  return spriteMesh;
}

function dampOpacity(material, target, delta) {
  material.opacity = THREE.MathUtils.damp(material.opacity, target, 7, delta);
}

function createSoftDiscTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.58)");
  g.addColorStop(0.52, "rgba(0,0,0,0.26)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function createExhaustTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 34, 2, 64, 124, 112);
  g.addColorStop(0, "rgba(255,255,255,0.86)");
  g.addColorStop(0.18, "rgba(255,70,70,0.72)");
  g.addColorStop(0.58, "rgba(255,24,24,0.24)");
  g.addColorStop(1, "rgba(255,24,24,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 256);
  return new THREE.CanvasTexture(c);
}

function createSteamTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 5, 64, 64, 62);
  g.addColorStop(0, "rgba(255,255,255,0.28)");
  g.addColorStop(0.45, "rgba(170,170,170,0.11)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
