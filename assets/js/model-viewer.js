import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function showFallback(container, previewUrl) {
  container.classList.add('model-viewer-fallback');
  container.innerHTML = '';
  if (previewUrl) {
    const img = document.createElement('img');
    img.src = previewUrl;
    img.alt = 'Static render of the 3D model';
    img.className = 'model-viewer-fallback-image';
    container.appendChild(img);
  }
}

function initViewer(container) {
  const modelUrl = container.dataset.model;
  const previewUrl = container.dataset.preview;
  const canvas = container.querySelector('.model-viewer-canvas');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    showFallback(container, previewUrl);
    return;
  }
  if (!renderer.getContext()) {
    showFallback(container, previewUrl);
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 30, 100);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(1, 1, 1);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-1, 0.5, -1);
  scene.add(fillLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 20;
  controls.maxDistance = 400;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotate = !prefersReducedMotion;
  controls.autoRotateSpeed = 2;

  const loader = new STLLoader();
  loader.load(
    modelUrl,
    (geometry) => {
      geometry.center();
      geometry.computeBoundingSphere();
      const scale = 40 / geometry.boundingSphere.radius;

      const material = new THREE.MeshStandardMaterial({
        color: 0xe6e6e0,
        metalness: 0.1,
        roughness: 0.65,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(scale);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
    },
    undefined,
    () => {
      showFallback(container, previewUrl);
    }
  );

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.querySelectorAll('.model-viewer').forEach(initViewer);
