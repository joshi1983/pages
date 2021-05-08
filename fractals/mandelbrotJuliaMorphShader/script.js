"use strict"

/*
Written by Josh Greig around January 15, 2021.
*/
window.addEventListener("DOMContentLoaded", function() {
	let canvas = document.querySelector('canvas');
	let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	let pid = gl.createProgram();
	var h = canvas.clientHeight;
	var w = canvas.clientWidth;
	var centreOffset = [0, 0];
	loadShaders();
	let locationOfCentre = gl.getUniformLocation(pid, 'centre');
	let locationOfScale = gl.getUniformLocation(pid, 'scale');
	let locationOfMandelbrotOffset = gl.getUniformLocation(pid, 'mandelbrotOffset');
	let locationOfMorphRatio = gl.getUniformLocation(pid, 'morphRatio');
	let locationOfFractalIterationDelta = gl.getUniformLocation(pid, 'fractalIterationDelta');
	let locationOfIsSubpixelSampling = gl.getUniformLocation(pid, 'isSubpixelSampling');
	var pixelStretch = 1;
	var times = [];
	var pixelStretchDrawTimings = {};
	var scaleFactor = 5;
	var lastZoomTime = undefined;
	var isDrawnHighQuality = false;
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
		
		// check compile status to more quickly troubleshoot shader bugs
		var compiled = gl.getShaderParameter(sid, gl.COMPILE_STATUS);
		if (!compiled) {
			console.log('Shader compiled successfully: ' + compiled);
			var compilationLog = gl.getShaderInfoLog(sid);
			console.log('Shader compiler log: ' + compilationLog);
		}
		gl.attachShader(pid, sid);
	}

	function optimizeFrameRateAndQuality() {
		var t = new Date().getTime();
		var processInterval = 1000;
		// Do nothing except every few seconds.
		if (times.length === 0 || 
		Math.floor(t / processInterval) !== Math.floor(times[times.length - 1] / processInterval)) {
			times = times.filter(function(t2) {
				return t - t2 < 1000;
			});
			if (!zoomedRecently())
				drawHighQuality();

			var newPixelStretch = pixelStretch;
			if (pixelStretchDrawTimings[pixelStretch] > 30) {
				newPixelStretch = pixelStretch + 1;
			}
			else if (pixelStretchDrawTimings[pixelStretch] < 15) {
				newPixelStretch = Math.max(1, pixelStretch - 1);
			}
			if (newPixelStretch !== pixelStretch) {
				pixelStretch = newPixelStretch;
				resized(); // update the scale and centre uniforms.
			}
		}
		times.push(t);
	}
	
	var scaleFactorBeforeZoom;
	var zoomScaleTime = undefined;
	var offsetBeforeZoom;
	var zoomFinalOffset;
	var finalZoomFactor;
	var zoomOffsets = [];
	function updateZoom() {
		if (zoomScaleTime === undefined)
			return; // not zooming so do nothing.
		var t = new Date().getTime();
		var deltaT = t - zoomScaleTime;
		var maxDeltaT = 400;
		var ratio = Math.min(maxDeltaT, t - zoomScaleTime) / maxDeltaT;
		var ratio2 = 1 - ratio;
		var newZoomScaleFactor = scaleFactorBeforeZoom * ratio2 + finalZoomFactor * ratio;
		scaleFactor = newZoomScaleFactor;
		
		centreOffset = [
			offsetBeforeZoom[0] * ratio2 + zoomFinalOffset[0] * ratio,
			offsetBeforeZoom[1] * ratio2 + zoomFinalOffset[1] * ratio,
		];
		
		// if zooming complete, reset the variables.
		if (deltaT > maxDeltaT)	{
			zoomScaleTime = undefined;
			scaleFactorBeforeZoom = undefined;
			offsetBeforeZoom = undefined;
			zoomFinalOffset = undefined;
			finalZoomFactor = undefined;
		}
		updateLastZoomTime();
	}
	
	function updateLastZoomTime() {
		lastZoomTime = new Date().getTime();
	}
	
	function startZoomIn(finalOffset) {
		// don't allow more than one zoom at a time.
		if (zoomScaleTime !== undefined)
			return;
		scaleFactorBeforeZoom = scaleFactor;
		finalZoomFactor = scaleFactor * 0.4;
		zoomScaleTime = new Date().getTime();
		offsetBeforeZoom = centreOffset;
		zoomFinalOffset = finalOffset;
		zoomOffsets.push(zoomFinalOffset);
	}
	
	function startZoomOut(newFinalZoomFactor) {
		// don't allow more than one zoom at a time.
		if (zoomScaleTime !== undefined)
			return;
		scaleFactorBeforeZoom = scaleFactor;
		if (typeof newFinalZoomFactor !== 'number')
			finalZoomFactor = scaleFactor / 0.4;
		else
			finalZoomFactor = newFinalZoomFactor;
		zoomScaleTime = new Date().getTime();
		offsetBeforeZoom = centreOffset;
		if (zoomOffsets.length > 0)
			zoomFinalOffset = zoomOffsets.pop();
		else
			zoomFinalOffset = [0,0];
	}
	
	function zoomedRecently() {
		return lastZoomTime !== undefined && new Date().getTime() - lastZoomTime < 500;
	}
	
	function drawHighQuality() {
		// Don't needlessly draw in high quality.
		if (isDrawnHighQuality)
			return;
		var originalPixelStretch = pixelStretch;
		pixelStretch = 0.5;
		gl.uniform1i(locationOfIsSubpixelSampling, 1);
		drawWebGLGraphics();
		gl.uniform1i(locationOfIsSubpixelSampling, 0);
		pixelStretch = originalPixelStretch;
	}

	function drawWebGLGraphics() {
		isDrawnHighQuality = pixelStretch < 1;
		var tStart = new Date().getTime();
		gl.viewport(0, 0, w, h);
		gl.clearColor(0, 0, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		var tEnd = new Date().getTime();
		var tDelta = tEnd - tStart;
		var ratio = 0.1;
		var ratio2 = 1 - ratio;
		if (pixelStretchDrawTimings[pixelStretch] === undefined)
			pixelStretchDrawTimings[pixelStretch] = tDelta;
		else
			pixelStretchDrawTimings[pixelStretch] = pixelStretchDrawTimings[pixelStretch] * ratio2 + tDelta * ratio;
	}

	function drawGraphics() {
		updateZoom();
		optimizeFrameRateAndQuality();
		updateScale();
		resized();

		if (zoomedRecently()) {
			drawWebGLGraphics();
		}
		requestAnimationFrame(drawGraphics);
	}
	
	function getScaleValue() {
		return scaleFactor / Math.min(w, h);
	}
	
	function updateScale() {
		var scaleValue = getScaleValue();
		gl.uniform1f(locationOfScale, scaleValue);
	}
	
	function getCentre() {
		var scaleValue = getScaleValue();
		return [w / 2 - centreOffset[0] / scaleValue, h / 2 - centreOffset[1] / scaleValue];
	}

	// called every time the window resizes or pixelStretch is changed.
	function resized() {
		w = window.innerWidth;
		h = window.innerHeight;

		w /= pixelStretch;
		h /= pixelStretch;
		
		canvas.setAttribute('width', Math.round(w));
		canvas.setAttribute('height', Math.round(h));
		updateScale();
		gl.uniform2fv(locationOfCentre, getCentre());
	}
	
	function okClicked() {
		document.getElementById('dialog').setAttribute('class', 'closed');
	}
		
	function zoomInClick(event) {
		var x = event.clientX;
		var y = event.clientY;
		if (x === undefined && event.targetTouches.length > 0) {
			var touch = event.targetTouches[0];
			x = touch.pageX;
			y = touch.pageY;
		}
		if (x !== undefined && y !== undefined) {
			var scaleValue = getScaleValue();
			var centre = getCentre();
			var dx = x / pixelStretch - w/2;
			var dy = y / pixelStretch - h/2;
			// convert to the coordinates used in the shader.
			
			resized();
			startZoomIn([centreOffset[0] + dx * scaleValue, centreOffset[1] - dy * scaleValue]);
		}
	}
	
	function keyDown(event) {
		if (event.keyCode === 8)
			startZoomOut();
	}

	function initMorphRatioSelector() {
		var e = document.getElementById('morph-ratio');
		function updated() {
			var newValue = parseFloat(e.value);
			gl.uniform1f(locationOfMorphRatio, newValue);
			updateLastZoomTime();
		}
		e.addEventListener('input', updated);
		document.getElementById('use-julia-ratio').addEventListener('click', function() {
			e.value = 1;
			updated();
		});
		document.getElementById('use-mandelbrot-ratio').addEventListener('click', function() {
			e.value = 0;
			updated();
		});
		updated();
	}

	function initMandelbrotOffsetSelector() {
		var x = document.getElementById('mandelbrot-x');
		var y = document.getElementById('mandelbrot-y');

		function updateMandelbrotPoint() {
			var newValue = [x, y].map(function(v) {
				return parseFloat(v.value);
			});
			gl.uniform2fv(locationOfMandelbrotOffset, newValue);
			updateLastZoomTime();
		}

		x.addEventListener('input', updateMandelbrotPoint);
		y.addEventListener('input', updateMandelbrotPoint);
		updateMandelbrotPoint();
	}

	function initMaxIterationSelector() {
		var e = document.getElementById('max-iterations');
		function deltaUpdated() {
			var newValue = 1.0 / parseFloat(e.value);
			gl.uniform1f(locationOfFractalIterationDelta, newValue);
			updateLastZoomTime();
		}
		e.addEventListener('input', deltaUpdated);
		deltaUpdated();
	}

	function initZoom() {
		document.getElementById('zoom-out').addEventListener('click', startZoomOut);
		document.getElementById('reset-zoom').addEventListener('click', function() {
			startZoomOut(5);
		});
	}

	function initToggleSettings() {
		document.getElementById('toggle-settings').addEventListener('click', function() {
			var settings = document.getElementById('settings');
			settings.classList.toggle('expanded');
		});
	}

	resized();
	window.addEventListener('resize', function() {
		resized();
		updateLastZoomTime();
	});
	updateLastZoomTime();
	drawGraphics();
	initMorphRatioSelector();
	initMandelbrotOffsetSelector();
	initMaxIterationSelector();
	initZoom();
	initToggleSettings();
	document.getElementById('ok-button').addEventListener('click', okClicked);
	canvas.addEventListener('click', zoomInClick);
	canvas.addEventListener('touchstart', zoomInClick);
	window.addEventListener('keydown', keyDown);
});