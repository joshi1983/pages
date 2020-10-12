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
  let locationOfViewRotation2 = gl.getUniformLocation(pid, "viewRotation2");
  let locationOfScale = gl.getUniformLocation(pid, "scale");
  let rotationAngle = 0;
  let rotationAngle2 = 0;
  resized();

  let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

  gl.vertexAttribPointer(al, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(al);
 
  var times = [];
  var rotationRadius = 1.5;
  var oldMouseX, oldMouseY, oldTouchX, oldTouchY;
  draw();
  
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

  function mouseMoved(event) {
	  if (typeof oldMouseX === 'number') {
		  rotationAngle += (oldMouseX - event.clientX) * 0.001;
		  rotationAngle2 += (oldMouseY - event.clientY) * 0.001;
		  oldMouseX = event.clientX;
		  oldMouseY = event.clientY;
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
	var x = event.targetTouches[0].pageX;
	var y = event.targetTouches[0].pageY;
	if (typeof x === 'number' && typeof y === 'number') {
		rotationAngle += (oldTouchX - x) * 0.001;
		rotationAngle2 += (oldTouchY - y) * 0.001;
		oldTouchX = x;
		oldTouchY = y;
	}
  }
  
  function touchStart(event) {
	  oldTouchX = event.targetTouches[0].pageX;
	  oldTouchY = event.targetTouches[0].pageY;
  }

  window.addEventListener('resize', resized);
  canvas.addEventListener('mousemove', mouseMoved);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('touchstart', touchStart);
  canvas.addEventListener('touchmove', touchMove);
  resized();
});