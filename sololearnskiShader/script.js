"use strict"

/*
Written by Josh Greig around October 24, 2020.
*/
window.addEventListener("DOMContentLoaded", function() {
	let canvas = document.querySelector('canvas');
	let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	let pid = gl.createProgram();
	var h = canvas.clientHeight;
	var w = canvas.clientWidth;
	loadShaders();
	let locationOfCentre = gl.getUniformLocation(pid, 'centre');
	let locationOfScale = gl.getUniformLocation(pid, 'scale');
	let locationOfCutoffs = gl.getUniformLocation(pid, 'cutOffs');
	var pixelStretch = 1;
	var times = [];
  	initCoords();

	function initCoords() {
		let coords = gl.getAttribLocation(pid, 'coords');
		let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

		gl.vertexAttribPointer(coords, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(coords);
	}

	function loadShaders() {
		shader('script[type="glsl/vertex"]', gl.VERTEX_SHADER);
		shader('script[type="glsl/fragment"]', gl.FRAGMENT_SHADER);
		gl.linkProgram(pid);
		gl.useProgram(pid);
	}

	function shader(cssSelector, type) {
		let src = document.querySelector(cssSelector).innerText;
		let sid = gl.createShader(type);
		gl.shaderSource(sid, src);
		gl.compileShader(sid);
		gl.attachShader(pid, sid);
	}

	function optimizeFrameRateAndQuality() {
		var t = new Date().getTime();
		var processInterval = 3000;
		// Do nothing except every few seconds.
		if (times.length === 0 || Math.floor(t / processInterval) !== Math.floor(times[times.length - 1] / processInterval)) {
			times = times.filter(function(t2) {
				return t - t2 < 1000;
			});
			var newPixelStretch = pixelStretch;
			if (times.length < 24) {
				newPixelStretch = pixelStretch + 1;
			}
			else if (times.length > 55) {
				newPixelStretch = Math.max(1, pixelStretch - 1);
			}
			if (newPixelStretch !== pixelStretch) {
				pixelStretch = newPixelStretch;
				resized(); // update the scale and centre uniforms.
			}
		}
		times.push(t);
	}

	function drawGraphics() {
		optimizeFrameRateAndQuality();
		updateScale();
		gl.viewport(0, 0, w, h);
		gl.clearColor(0, 0, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		requestAnimationFrame(drawGraphics);
	}
	
	function getScaleValue() {
		var t = new Date().getTime();
		return (3 + Math.sin(t * 0.001)) / Math.min(w, h);
	}
	
	function updateScale() {
		var scaleValue = getScaleValue();
		gl.uniform1f(locationOfScale, scaleValue);
		var cutOffs = [scaleValue * 0.2, scaleValue * 1];
		gl.uniform2fv(locationOfCutoffs, cutOffs);
	}

	// called every time the window resizes or pixelStretch is changed.
	function resized() {
		w = window.innerWidth;
		h = window.innerHeight;

		w /= pixelStretch;
		h /= pixelStretch;
		
		canvas.setAttribute('width', Math.round(w));
		canvas.setAttribute('height', Math.round(h));
		var centre = [w / 2, h / 2];
		updateScale();
		gl.uniform2fv(locationOfCentre, centre);
	}

	// Passes the circles data to the circles uniform in the shader.
	function initCircles() {
		var locationOfCircles = gl.getUniformLocation(pid, 'circles');
		var circleData = [];
		var sololearnCx = circles[1].cx * 0.8788;
        var sololearnCy = circles[1].cx * 1.6835;
        var sololearnRadius = sololearnCy * 1.02;

		var a = 1.55 * Math.PI / 3;
		var sinA = Math.sin(a);
		var cosA = Math.cos(a);
		circles.forEach(function(circle) {
			var x = circle.cx - sololearnCx;
			var y = circle.cy - sololearnCy;
			circleData.push((x * cosA - y * sinA) / sololearnRadius);
			circleData.push((y * cosA + x * sinA) / sololearnRadius);
			var r = circle.radius * circle.radius / sololearnRadius / sololearnRadius;
			circleData.push(r);
		});
		gl.uniform1fv(locationOfCircles, new Float32Array(circleData));
	}
	
	function okClicked() {
		document.getElementById('dialog').setAttribute('class', 'closed');
	}

	initCircles();
	resized();
	window.addEventListener('resize', resized);
	drawGraphics();
	document.getElementById('ok-button').addEventListener('click', okClicked);
});