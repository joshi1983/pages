/*
This uses three.js to show a rotating sphere that is textured with a flat map of Earth.

Please upvote if you want others to see it.

This code may be helpful to anyone wanting a starting point for using three.js.

If you want ideas on ways to play with this code and learn more with it, here are some:
- Create an interactive tutorial or lesson on:
    - Moon phases:  Move the light source around to simulate moon phases and mix in some text or audio to explain what is going on.
    - Solar system:  Make it possible to navigate to every planet and the sun, view their surfaces.
- Represent Saturn and its rings.  You might want to use RingGeometry for the rings.
*/


function setupAnimationLoop(renderer, scene, camera) {
	function update () {
	  // Draw!
	  renderer.render(scene, camera);

	  // Schedule the next frame.
	  requestAnimationFrame(update);
	}

	requestAnimationFrame(update);	
}

function updateSphereAnimation(sphere) {
	return function() {
		
		//sphere.position.z += 0.2;
		sphere.rotation.y += 0.001;
	};
}

function addSphereWithSpecifiedMaterial(scene, material) {
	// Set up the sphere vars
	const RADIUS = 50;
	const SEGMENTS = 58;
	const RINGS = 58;
	// create the sphere's material
	const sphereMaterial = material;
	// Create a new mesh with
	// sphere geometry - we will cover
	// the sphereMaterial next!
	const sphere = new THREE.Mesh(

	  new THREE.SphereGeometry(
		RADIUS,
		SEGMENTS,
		RINGS),

	  sphereMaterial);

	// Move the Sphere back in Z so we
	// can see it.
	sphere.position.z = -1800;

	// Finally, add the sphere to the scene.
	scene.add(sphere);

    // Start animating the sphere so it continually rotates slowly.
	window.setInterval(updateSphereAnimation(sphere), 15);
}

function addSphere(scene) {
// create the sphere's material
var loader = new THREE.TextureLoader();
    // load a resource
	loader.load(
		// a fairly high resolution image of the Earth with clouds
		'https://upload.wikimedia.org/wikipedia/commons/9/9d/MODIS_Map.jpg',
		// Function when resource is loaded
		function ( texture ) {
			// do something with the texture
			var material2 = new THREE.MeshPhongMaterial({
				map: texture,
				shininess  :  10
				});
			var material = new THREE.MeshBasicMaterial( {
				map: texture
			 } );
			 addSphereWithSpecifiedMaterial(scene, material2);
			 $('.downloading').fadeOut();
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}

function addLight(scene) {
	// create a point light
	const pointLight =
	  new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 3000;
	pointLight.position.y = 50;
	pointLight.position.z = 230;

	// add to the scene
	scene.add(pointLight);	
}

$(function() {
	// Set the scene size.
	const WIDTH = $('#container').width();
	const HEIGHT = $('#container').height();

	// Set some camera attributes.
	const VIEW_ANGLE = 5.5;
	const ASPECT = WIDTH / HEIGHT;
	const NEAR = 0.1;
	const FAR = 10000;

	// Get the DOM element to attach to
	const container = document.querySelector('#container');

	// Create a WebGL renderer, camera
	// and a scene
	const renderer = new THREE.WebGLRenderer();
	const camera =
		new THREE.PerspectiveCamera(
			VIEW_ANGLE,
			ASPECT,
			NEAR,
			FAR
		);

	const scene = new THREE.Scene();

	// Add the camera to the scene.
	scene.add(camera);
	
	addSphere(scene);
	addLight(scene);

	// Start the renderer.
	renderer.setSize(WIDTH, HEIGHT);
	setupAnimationLoop(renderer, scene, camera);

	// Attach the renderer-supplied
	// DOM element.
	container.appendChild(renderer.domElement);
});