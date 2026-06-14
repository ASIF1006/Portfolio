import * as THREE from 'three';

// ── CYBER CONFIG ──
const config = {
    gridSize: 40,
    gridDivisions: 40,
    gridSpeed: 0.8,
    gridColor1: '#ff2d95',
    gridColor2: '#00fff5',
    gridOpacity: 0.35,
    horizonY: -2,
    perspective: 8,
    particleCount: 300,
    particleColor: '#ff2d95',
    particleSize: 0.04,
    scrollIntensityY: 4.0
};

// ── SCENE ──
const canvas = document.getElementById('gridCanvas');
const scene = new THREE.Scene();
const sizes = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 200);
camera.position.set(0, config.perspective, 5);
camera.lookAt(0, config.horizonY, -20);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// ── NEON GRID ──
let gridHelper, gridMaterial;
const gridGroup = new THREE.Group();

function createGrid() {
    // Remove old grid
    while (gridGroup.children.length > 0) {
        const child = gridGroup.children[0];
        child.geometry.dispose();
        child.material.dispose();
        gridGroup.remove(child);
    }

    const gridSize = config.gridSize;
    const divisions = config.gridDivisions;
    const step = gridSize / divisions;
    const halfSize = gridSize / 2;

    // Horizontal lines
    const hGeom = new THREE.BufferGeometry();
    const hPositions = [];
    const hColors = [];
    const c1 = new THREE.Color(config.gridColor1);
    const c2 = new THREE.Color(config.gridColor2);

    for (let i = 0; i <= divisions; i++) {
        const z = -halfSize + i * step;
        const t = i / divisions;
        hPositions.push(-halfSize, 0, z, halfSize, 0, z);
        const color = c1.clone().lerp(c2, t);
        hColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }

    hGeom.setAttribute('position', new THREE.Float32BufferAttribute(hPositions, 3));
    hGeom.setAttribute('color', new THREE.Float32BufferAttribute(hColors, 3));

    gridMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: config.gridOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    gridGroup.add(new THREE.LineSegments(hGeom, gridMaterial));

    // Vertical lines
    const vGeom = new THREE.BufferGeometry();
    const vPositions = [];
    const vColors = [];

    for (let i = 0; i <= divisions; i++) {
        const x = -halfSize + i * step;
        const t = i / divisions;
        vPositions.push(x, 0, -halfSize, x, 0, halfSize);
        const color = c2.clone().lerp(c1, t);
        vColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }

    vGeom.setAttribute('position', new THREE.Float32BufferAttribute(vPositions, 3));
    vGeom.setAttribute('color', new THREE.Float32BufferAttribute(vColors, 3));

    gridGroup.add(new THREE.LineSegments(vGeom, gridMaterial.clone()));

    // Position grid below camera
    gridGroup.position.y = config.horizonY;
    scene.add(gridGroup);
}

createGrid();

// ── FLOATING PARTICLES ──
const particleGeom = new THREE.BufferGeometry();
const particlePositions = new Float32Array(config.particleCount * 3);
const particleColorsArr = new Float32Array(config.particleCount * 3);
const particleSizesArr = new Float32Array(config.particleCount);

const pCol1 = new THREE.Color(config.gridColor1);
const pCol2 = new THREE.Color(config.gridColor2);

for (let i = 0; i < config.particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 30;
    particlePositions[i3 + 1] = Math.random() * 15 - 2;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 40 - 10;

    const color = Math.random() < 0.5 ? pCol1 : pCol2;
    particleColorsArr[i3] = color.r + (Math.random() - 0.5) * 0.2;
    particleColorsArr[i3 + 1] = color.g + (Math.random() - 0.5) * 0.2;
    particleColorsArr[i3 + 2] = color.b + (Math.random() - 0.5) * 0.2;

    particleSizesArr[i] = config.particleSize * (0.5 + Math.random());
}

particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColorsArr, 3));

const particleMat = new THREE.PointsMaterial({
    size: config.particleSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    opacity: 0.6
});

const floatingParticles = new THREE.Points(particleGeom, particleMat);
scene.add(floatingParticles);

// ── GUI (lazy-loaded) ──
const toggleBtn = document.getElementById('cyberControlsToggle');
let gui = null;

if (toggleBtn) {
    toggleBtn.addEventListener('click', async function() {
        if (!gui) {
            const { default: GUI } = await import('lil-gui');
            gui = new GUI({ title: '⚡ Cyber Controls', width: 280 });
            gui.domElement.style.position = 'fixed';
            gui.domElement.style.top = '80px';
            gui.domElement.style.right = '20px';
            gui.domElement.style.left = 'auto';
            gui.domElement.style.zIndex = '9999';
            gui.domElement.style.borderRadius = '8px';
            gui.domElement.style.overflow = 'hidden';
            gui.domElement.style.boxShadow = '0 0 30px rgba(255,0,110,0.15), 0 0 60px rgba(0,0,0,0.5)';

            const gridFolder = gui.addFolder('🔲 Grid');
            gridFolder.addColor(config, 'gridColor1').name('Pink Grid').onChange(() => createGrid());
            gridFolder.addColor(config, 'gridColor2').name('Cyan Grid').onChange(() => createGrid());
            gridFolder.add(config, 'gridOpacity', 0, 1, 0.05).name('Grid Opacity').onChange(() => {
                gridGroup.children.forEach(c => { if (c.material) c.material.opacity = config.gridOpacity; });
            });
            gridFolder.add(config, 'gridSpeed', 0, 3, 0.1).name('Scroll Speed');
            gridFolder.close();

            const particleFolder = gui.addFolder('✨ Particles');
            particleFolder.addColor(config, 'particleColor').name('Particle Color');
            particleFolder.add(config, 'particleSize', 0.01, 0.1, 0.005).name('Particle Size').onChange(() => { particleMat.size = config.particleSize; });
            particleFolder.add(config, 'particleCount', 50, 1000, 50).name('Particle Count');
            particleFolder.close();

            const structFolder = gui.addFolder('📐 Structure');
            structFolder.add(config, 'horizonY', -5, 5, 0.5).name('Horizon Y');
            structFolder.add(config, 'perspective', 2, 15, 0.5).name('Camera Height');
            structFolder.add(config, 'scrollIntensityY', 0, 10, 0.5).name('Scroll Fade');
            structFolder.close();
        }
        var isHidden = gui.domElement.style.display === 'none';
        gui.domElement.style.display = isHidden ? 'block' : 'none';
        toggleBtn.classList.toggle('active', isHidden);
    });
}

// Keyboard shortcut: Ctrl+Shift+C
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (toggleBtn) toggleBtn.click();
    }
});

// Close GUI when clicking outside
document.addEventListener('click', function(e) {
    if (gui && gui.domElement.style.display !== 'none' &&
        !gui.domElement.contains(e.target) &&
        e.target !== toggleBtn &&
        !toggleBtn.contains(e.target)) {
        gui.domElement.style.display = 'none';
        toggleBtn.classList.remove('active');
    }
});

// ── SCROLL ──
let scrollProgress = 0, smoothScrollProgress = 0;
window.addEventListener('scroll', function() {
    const sh = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = sh > 0 ? window.scrollY / sh : 0;
});

// ── RESIZE ──
window.addEventListener('resize', function() {
    sizes.width = window.innerWidth; sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ── ANIMATE ──
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    smoothScrollProgress += (scrollProgress - smoothScrollProgress) * 0.15;

    // Move grid forward for infinite scroll feel
    gridGroup.position.z = (elapsed * config.gridSpeed) % (config.gridSize / config.gridDivisions);

    // Gentle camera sway
    camera.position.x = Math.sin(elapsed * 0.1) * 0.3;
    camera.position.y = config.perspective + Math.sin(elapsed * 0.15) * 0.2;

    // Animate floating particles
    const pPos = floatingParticles.geometry.attributes.position.array;
    for (let i = 0; i < config.particleCount; i++) {
        const i3 = i * 3;
        pPos[i3 + 1] += Math.sin(elapsed * 0.5 + i * 0.1) * 0.002;
        // Wrap around
        if (pPos[i3 + 1] > 13) pPos[i3 + 1] = -2;
    }
    floatingParticles.geometry.attributes.position.needsUpdate = true;

    // Scroll fade
    const fade = Math.max(0, 1 - smoothScrollProgress * config.scrollIntensityY * 0.45);
    if (gridMaterial) {
        gridGroup.children.forEach(c => { if (c.material) c.material.opacity = config.gridOpacity * fade; });
    }
    particleMat.opacity = 0.6 * fade;

    renderer.render(scene, camera);
}

animate();