import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const FEATURED_MODELS = ['KTM_RC_390.glb', 'Ducati_SuperSport_950.glb', 'Yamaha_YZF-R6.glb'];
const file = FEATURED_MODELS[Math.floor(Math.random() * FEATURED_MODELS.length)];

const canvas = document.getElementById('auth-canvas');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1000);

  scene.add(new THREE.HemisphereLight(0xf6f4fb, 0x12101c, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(5, 8, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x34d8ff, 1.6);
  rim.position.set(-6, 3, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xff4d6d, 0.6);
  fill.position.set(-3, -2, 4); scene.add(fill);

  let bike = null;
  const pivot = new THREE.Group();
  scene.add(pivot);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  const loader = new GLTFLoader();
  loader.load('models/' + file, (gltf) => {
    bike = gltf.scene;
    const box = new THREE.Box3().setFromObject(bike);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    bike.position.sub(center);
    pivot.add(bike);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fitDist = (maxDim * 1.5) / Math.tan((camera.fov * Math.PI / 180) / 2);
    camera.position.set(fitDist * 0.5, fitDist * 0.25, fitDist * 0.75);
    camera.near = maxDim / 100; camera.far = maxDim * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  let mouseX = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
  });

  function animate() {
    requestAnimationFrame(animate);
    pivot.rotation.y += 0.004;
    pivot.rotation.y += (mouseX * 0.6 - pivot.rotation.y * 0.02) * 0.01;
    renderer.render(scene, camera);
  }
  animate();
}
