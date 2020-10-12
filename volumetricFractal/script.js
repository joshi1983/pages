"use strict"

window.addEventListener("DOMContentLoaded", function() {
  let canvas = document.querySelector('canvas');
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  var h;
  var w;
  let pid = gl.createProgram();
  shader('glsl/vertex', gl.VERTEX_SHADER);
  shader('glsl/fragment', gl.FRAGMENT_SHADER);
  gl.linkProgram(pid);
  gl.useProgram(pid);
  let al = gl.getAttribLocation(pid, "coords");
  let locationOfCentre = gl.getUniformLocation(pid, "centre");
  let locationOfPosition = gl.getUniformLocation(pid, "position3D");
  let locationOfViewRotation = gl.getUniformLocation(pid, "viewRotation");
  let locationOfScale = gl.getUniformLocation(pid, "scale");
  let rotationAngle = 0;
  resized();

  let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

  gl.vertexAttribPointer(al, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(al);
 
  var times = [];
  var rotationRadius = 2.0;
  var oldMouseX, oldMouseY, oldTouchX, oldTouchY;
  
  function resized() {
	  w = window.innerWidth;
	  h = window.innerHeight;
	  canvas.setAttribute('width', w);
	  canvas.setAttribute('height', h);
	  gl.uniform2fv(locationOfCentre, [w / 2, h / 2]);
	  gl.uniform1f(locationOfScale, 10.0 / (w + h));
  }

  function setRotationAngle(newAngle) {
	var a = Math.PI + newAngle;
	gl.uniform2fv(locationOfViewRotation, [Math.cos(a), Math.sin(a)]);
	gl.uniform3fv(locationOfPosition, [rotationRadius * Math.sin(newAngle), 0, rotationRadius * Math.cos(newAngle)]);
  }

  function processTimeChange() {
	var t = new Date().getTime();
	times = times.filter(function(time1) {
	  return t - time1 < 1000;
	});
	if (times.length > 0 && Math.floor(times[times.length - 1] / 3000) !== Math.floor(t / 3000)) {
	  console.log(times.length + "fps");
	}
	var rotationPeriod = 500000;
	if (times.length > 0) {
		rotationAngle += (t - times[times.length - 1]) * Math.PI * 2 / rotationPeriod;
	}
	times.push(t);
	setRotationAngle(rotationAngle);
  }

  function draw() {
	processTimeChange();
	gl.viewport(0, 0, w, h);
	gl.clearColor(0, 0, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	requestAnimationFrame(draw);
  }

  function shader(name, type) {
    let src = [].slice.call(document.scripts).find(s => s.type === name).innerText;
    let sid = gl.createShader(type);
    gl.shaderSource(sid, src);
    gl.compileShader(sid);
    gl.attachShader(pid, sid);
  }
  
  function processDrag(dx, dy) {
		rotationAngle += dx * 0.002;
		rotationRadius += dy * 0.002;
  }

  function mouseMoved(event) {
	  if (typeof oldMouseX === 'number') {
			var x = event.clientX;
			var y = event.clientY;
			processDrag(oldMouseX - x, oldMouseY - y);
			oldMouseX = x;
			oldMouseY = y;
	  }
  }

  function mouseDown(event) {
	  oldMouseX = event.clientX;
	  oldMouseY = event.clientY;
  }

  function mouseUp(event) {
	  oldMouseX = undefined;
	  oldMouseY = undefined;
  }
  
  function touchMove(event) {
	if (event.targetTouches.length === 0) {
		/* rarely happens but I hit this case 
		while touching and dragging a few times quickly.
		*/
		return;
	}
	var x = event.targetTouches[0].pageX;
	var y = event.targetTouches[0].pageY;
	if (typeof x === 'number' && typeof y === 'number' 
	&& typeof oldTouchX === 'number' && typeof oldTouchY === 'number') {
		processDrag(oldTouchX - x, oldTouchY - y);
		oldTouchX = x;
		oldTouchY = y;
	}
  }

  function touchStart(event) {
	  oldTouchX = event.targetTouches[0].pageX;
	  oldTouchY = event.targetTouches[0].pageY;
  }
  
  function touchEnd(event) {
	  oldTouchX = undefined;
	  oldTouchY = undefined;
  }
  
  function initSettings() {
	  var body = document.querySelector('body');
	  var settingsCloseButton = document.getElementById('collapse-settings-button');
	  var settingsExpandButton = document.getElementById('expand-settings-button');
	  var sphereRadiusInput = document.getElementById('sphere-radius');
	  var cRealInput = document.getElementById('c-real');
	  var showSphereOutlineInput = document.getElementById('show-outline');
	  var lightDirectionX = document.getElementById('light-x');
	  var lightDirectionY = document.getElementById('light-y');
	  var lightDirectionZ = document.getElementById('light-z');
	  var maxIterations = document.getElementById('max-iterations');
	  let locationOfFractalIterationDeltas = gl.getUniformLocation(pid, "fractalIterationDelta");
	  let locationOfShowingCircumference = gl.getUniformLocation(pid, "isShowingCircumference");
	  let locationOfSphereRadius = gl.getUniformLocation(pid, "sphereRadius");
	  let locationOfLightDirection = gl.getUniformLocation(pid, "lightDirection");
	  let locationOfCReal = gl.getUniformLocation(pid, "cReal");
	  
	  function sphereRadiusChanged() {
			let val = sphereRadiusInput.value;
			if (typeof val === 'string')
				val = parseFloat(val.trim());
			else
				val = 2;
			gl.uniform1f(locationOfSphereRadius, val);
	  }

	  function showSphereOutlineChanged() {
		  gl.uniform1i(locationOfShowingCircumference, !!showSphereOutlineInput.checked);
	  }
	  
	  function lightDirectionChanged() {
		  var x = parseFloat(lightDirectionX.value);
		  var y = parseFloat(lightDirectionY.value);
		  var z = parseFloat(lightDirectionZ.value);
		  var m = Math.sqrt(x * x + y * y + z * z);
		  if (m === 0) {
			  x = 1;
		  }
		  else {
			  x /= m;
			  y /= m;
			  z /= m;
		  }
		  gl.uniform3fv(locationOfLightDirection, [x, y, z]);
	  }
	  
	  function maxIterationsChanged() {
			var val = parseInt(maxIterations.value);
			if (typeof val !== 'number' || isNaN(val))
				val = 20;

			gl.uniform1f(locationOfFractalIterationDeltas, 1.0 / val);
	  }
	  
	  function cRealChanged() {
		  var val = parseFloat(cRealInput.value);
		  if (typeof val !== 'number' && !isNaN(val)) {
			  val = 0.7;
		  }
		  gl.uniform1f(locationOfCReal, val);
	  }
	  
	  function settingsClose() {
		  body.setAttribute('class', 'settings-collapsed');
	  }
	  
	  function settingsExpand() {
		  body.setAttribute('class', '');
	  }

	  sphereRadiusInput.addEventListener('input', sphereRadiusChanged);
	  showSphereOutlineInput.addEventListener('change', showSphereOutlineChanged);
	  [lightDirectionX, lightDirectionY, lightDirectionZ].forEach(function(input) {
		input.addEventListener('input', lightDirectionChanged);
	  });
	  maxIterations.addEventListener('input', maxIterationsChanged);
	  cRealInput.addEventListener('input', cRealChanged);
	  settingsCloseButton.addEventListener('click', settingsClose);
	  settingsExpandButton.addEventListener('click', settingsExpand);
	  sphereRadiusChanged();
	  showSphereOutlineChanged();
	  lightDirectionChanged();
	  maxIterationsChanged();
	  cRealChanged();
  }

	initSettings();
  window.addEventListener('resize', resized);
  canvas.addEventListener('mousemove', mouseMoved);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('touchstart', touchStart);
  canvas.addEventListener('touchmove', touchMove);
  canvas.addEventListener('touchend', touchEnd);
  resized();
  draw();
});