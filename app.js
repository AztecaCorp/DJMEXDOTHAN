// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ground (a simple plane)
const geometry = new THREE.PlaneGeometry(500, 500);
const material = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const ground = new THREE.Mesh(geometry, material);
ground.rotation.x = Math.PI / -2;  // Rotate to make it horizontal
scene.add(ground);

// Add some trees (simple cylinders)
function createTree(x, z) {
  const trunk = new THREE.CylinderGeometry(0.5, 0.5, 5);
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  const trunkMesh = new THREE.Mesh(trunk, trunkMaterial);
  trunkMesh.position.set(x, 2.5, z);
  scene.add(trunkMesh);

  const leaves = new THREE.SphereGeometry(3);
  const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
  const leavesMesh = new THREE.Mesh(leaves, leavesMaterial);
  leavesMesh.position.set(x, 7, z);
  scene.add(leavesMesh);
}

// Create trees
createTree(-10, -10);
createTree(20, 15);
createTree(-30, 20);

// Add lighting
const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(10, 30, 10);
scene.add(light);

// Camera position
camera.position.y = 5;
camera.position.z = 10;

// Physics variables
let velocity = new THREE.Vector3();
const speed = 0.1;
const jumpHeight = 2;
let canJump = true;
let isJumping = false;
let gravity = -0.1;

// Handle movement
let moveDirection = new THREE.Vector3();
const controls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
};

// Mouse movement variables
let mouseX = 0;
let mouseY = 0;
let sensitivity = 0.002; // Reduced sensitivity for smoother feel

// Pointer Lock event listener
function lockMouse() {
  document.body.requestPointerLock();
}

// Lock mouse when clicking
document.addEventListener('click', lockMouse);

// Pointer lock movement event
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    mouseX += event.movementX * sensitivity;
    mouseY -= event.movementY * sensitivity;  // Invert the mouse Y movement for more natural feel
  }
});

// Update movement states
window.addEventListener('keydown', (e) => {
  if (e.key === 'w') controls.forward = true;
  if (e.key === 's') controls.backward = true;
  if (e.key === 'a') controls.left = true;
  if (e.key === 'd') controls.right = true;
  if (e.key === ' ' && canJump) controls.jump = true;  // Spacebar to jump
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'w') controls.forward = false;
  if (e.key === 's') controls.backward = false;
  if (e.key === 'a') controls.left = false;
  if (e.key === 'd') controls.right = false;
  if (e.key === ' ') controls.jump = false;
});

// Apply gravity and jumping
function applyGravity() {
  if (camera.position.y > 5) { // When above ground
    velocity.y += gravity; // Apply gravity to Y velocity
  } else { // When on the ground
    camera.position.y = 5; // Reset to ground level
    velocity.y = 0; // Stop downward movement
    canJump = true; // Allow jumping again
  }
}

// Handle jumping logic
function jump() {
  if (controls.jump && canJump) {
    velocity.y = jumpHeight; // Apply jump force
    canJump = false; // Disable jumping until back on the ground
  }
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // Stop movement if no keys are pressed
  if (!controls.forward && !controls.backward && !controls.left && !controls.right) {
    moveDirection.set(0, 0, 0);
  }

  // Move the camera based on keys pressed
  if (controls.forward) moveDirection.z = -speed;
  if (controls.backward) moveDirection.z = speed;
  if (controls.left) moveDirection.x = -speed;
  if (controls.right) moveDirection.x = speed;

  camera.translateX(moveDirection.x);
  camera.translateZ(moveDirection.z);

  // Apply gravity and jumping
  applyGravity();
  jump();

  // Update camera position based on velocity
  camera.position.y += velocity.y;

  // Update camera rotation based on mouse movement
  camera.rotation.y = mouseX;  // Rotate horizontally (yaw)
  camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseY)); // Limit vertical rotation (pitch)

  // Render the scene
  renderer.render(scene, camera);
}

animate();
