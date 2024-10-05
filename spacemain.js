// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarSystemCanvas') });

// Set renderer size and background color to black
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);  // Black background

// Create OrbitControls for zooming and rotating
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;  // Minimum zoom distance
controls.maxDistance = 50; // Maximum zoom distance

// Create a yellow sphere to represent the Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);  // Sun size
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });  // Yellow color
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);  // Add the sun to the scene

// Planet data (size, color, distance from the Sun)
const planetsData = [
    { size: 0.2, color: 0xFF4500, distance: 5 },  // Mercury
    { size: 0.534, color: 0xFF6347, distance: 7 }, // Venus
    { size: 0.595, color: 0x1E90FF, distance: 9 },    // Earth
    { size: 0.446, color: 0xFFD700, distance: 11 }, // Mars
    { size: 1.0000, color: 0xDAA520, distance: 15 },   // Jupiter
    { size: 0.8432, color: 0x8A2BE2, distance: 19 },     // Saturn
    { size: 0.3280, color: 0x00CED1, distance: 23 },      // Uranus
    { size: 0.3245, color: 0x0000FF, distance: 27 }       // Neptune
];

// Create planets and orbits
const planets = [];
const orbitLines = [];
for (const { size, color, distance } of planetsData) {
    // Create planet
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);  // Planet size
    const planetMaterial = new THREE.MeshBasicMaterial({ color });  // Planet color
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);  // Add the planet to the scene
    planets.push({ mesh: planet, distance });  // Store planet mesh and distance

    // Create orbit line (dotted path)
    const orbitPoints = [];
    const orbitSegments = 100;  // Number of segments to create the orbit

    for (let i = 0; i < orbitSegments; i++) {
        const angle = (i / orbitSegments) * Math.PI * 2;  // Angle for circular path
        const x = distance * Math.cos(angle);
        const z = distance * Math.sin(angle);
        orbitPoints.push(new THREE.Vector3(x, 0, z));  // Push orbit point
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1, dashSize: 0.1, gapSize: 0.1 });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);  // Add the orbit line to the scene
    orbitLines.push(orbitLine);  // Store the orbit line
}

// Position the camera to view the Sun and the planets
camera.position.set(0, 0, 40);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the sun for effect
    sun.rotation.y += 0.01;  // Rotate the Sun slowly

    // Position the planets around the Sun
    const time = Date.now() * 0.001;  // Time variable for animation
    planets.forEach(({ mesh, distance }, index) => {
        mesh.position.x = distance * Math.cos(time + index);  // Calculate X position
        mesh.position.z = distance * Math.sin(time + index);  // Calculate Z position
    });

    controls.update();  // Update controls for camera interaction
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
