"use strict"

/*
Written by Josh Greig around November 3, 2020.
*/
window.addEventListener("DOMContentLoaded", function() {
	let canvas = document.getElementById('juliaset-display');
	let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	let pid = gl.createProgram();
	var h = canvas.clientHeight;
	var w = canvas.clientWidth;
	var centreOffset = [0, 0];
	loadShaders('juliaset', pid, gl);
	let locationOfCentre = gl.getUniformLocation(pid, 'centre');
	let locationOfScale = gl.getUniformLocation(pid, 'scale');
	let locationOfIsSubpixelSampling = gl.getUniformLocation(pid, 'isSubpixelSampling');
	let locationOfMandelbrotOffset = gl.getUniformLocation(pid, 'mandelbrotOffset');
	var pixelStretch = 1;
	var pixelStretchDrawTimings = {};
	var scaleFactor = 1.0;
	var isDrawnHighQuality = false;
	var body = document.querySelector('body');
	var needsWebGLDraw = false;
	var highresTimoutTimer;
  	initCoords(pid, gl);

	class Mandelbrot {
		constructor() {
			this.mandelbrotCanvas = document.querySelector('#mandelbrot-display canvas');
			this.gl = this.mandelbrotCanvas.getContext('webgl');
			this.pid = this.gl.createProgram();
			loadShaders('mandelbrot', this.pid, this.gl);
			initCoords(this.pid, this.gl);
			this.uniforms = {};
			var uniformKeys = ['mandelbrotOffset', 'scale', 'centre', 'isSubpixelSampling'];
			var outer = this;
			uniformKeys.forEach(function(key) {
				outer.uniforms[key] = outer.gl.getUniformLocation(outer.pid, key);
			});
			this.setMandelbrotOffset([0.4, 0.1]);
			var display = document.getElementById('mandelbrot-display');
			display.addEventListener('click', function(event) {
				var p;
				if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
					p = [
						event.pageX - $(outer.mandelbrotCanvas).offset().left,
						event.pageY - $(outer.mandelbrotCanvas).offset().top];
				}
				else if (event.targetTouches.length > 0) {
					var touch = event.targetTouches[0];
					p = [touch.pageX, touch.pageY];
				}
				if (p !== undefined && typeof p[0] === 'number' && typeof p[1] === 'number') {
					var scale = outer.getScale();
					var centre = outer.getPixelCentre();
					p[0] = outer.mandelbrotOffset[0] + (p[0] - centre[0]) * scale;
					p[1] = outer.mandelbrotOffset[1] + (p[1] - centre[1]) * scale;
					outer.startAnimatingToMandelbrotOffset(p);
				}
			});
			this.redraw();
		}
		
		startAnimatingToMandelbrotOffset(newOffset) {
			var startTime = new Date().getTime();
			var endTime = startTime + 500;
			var startOffset = this.mandelbrotOffset;
			var outer = this;

			function updateAnimation() {
				var t = new Date().getTime();
				var ratio = Math.min(1, (t - startTime) / (endTime - startTime));
				var ratio2 = 1 - ratio;
				var blendedOffset = [
					startOffset[0] * ratio2 + newOffset[0] * ratio,
					startOffset[1] * ratio2 + newOffset[1] * ratio
				];
				resized();
				outer.setMandelbrotOffset(blendedOffset);
				outer.redraw();
				drawWebGLGraphics(outer.gl, false);
				needsWebGLDraw = true;
				if (ratio < 1)
					requestAnimationFrame(updateAnimation);
			}

			this.adjustZoomForMandelbrotChange();
			updateAnimation();
		}
		
		adjustZoomForMandelbrotChange() {
			if (scaleFactor < 0.5) {
				scaleFactor = 0.5;
			}
		}

		setMandelbrotOffset(newOffset) {
			if (typeof newOffset !== 'object' || newOffset.length !== 2) 
				throw new Error('setMandelbrotOffset requires an Array of 2 numbers.');

			this.mandelbrotOffset = newOffset;
			gl.uniform2fv(locationOfMandelbrotOffset, newOffset);
			needsWebGLDraw = true;
		}

		getScale() {
			return getInitialScaleValue() * 3;
		}

		getPixelCentre() {
			var s = this.mandelbrotCanvas.clientWidth;
			s /= 2;
			return [s, s];
		}

		getCentre() {
			var p = this.getPixelCentre();
			var scale = this.getScale();
			return [p[0] - this.mandelbrotOffset[0] / scale, p[1] + this.mandelbrotOffset[1] / scale];
		}

		redraw() {
			var scale = this.getScale();
			var c = this.getCentre()[0];
			var s = this.mandelbrotCanvas.clientWidth;
			this.mandelbrotCanvas.setAttribute('width', s);
			this.mandelbrotCanvas.setAttribute('height', s);
			this.gl.uniform1f(this.uniforms.scale, scale);
			this.gl.uniform2fv(this.uniforms.centre, this.getCentre());
			drawWebGLGraphics(this.gl, false);
		}
	}

	var mandelbrot = new Mandelbrot();
	
	function initCoords(pid, gl) {
		let coords = gl.getAttribLocation(pid, 'coords');
		let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

		gl.vertexAttribPointer(coords, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(coords);
	}

	function loadShaders(fragmentShaderId, pid, gl) {
		shader('script[type="glsl/vertex"]', gl.VERTEX_SHADER, pid, gl);
		shader('script#' + fragmentShaderId, gl.FRAGMENT_SHADER, pid, gl);
		gl.linkProgram(pid);
		gl.useProgram(pid);
	}

	function shader(cssSelector, type, pid, gl) {
		let src = document.querySelector(cssSelector).innerText;
		if (type === gl.FRAGMENT_SHADER) {
			var commonUniformsSrc = document.getElementById('fragment-common-uniforms').innerText;
			var commonSrc = document.getElementById('fragment-common').innerText;
			src = commonUniformsSrc + src;
			src += commonSrc;
		}
		let sid = gl.createShader(type);
		gl.shaderSource(sid, src);
		gl.compileShader(sid);
		gl.attachShader(pid, sid);
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
		needsWebGLDraw = true;
		
		// if zooming complete, reset the variables.
		if (deltaT > maxDeltaT)	{
			zoomScaleTime = undefined;
			scaleFactorBeforeZoom = undefined;
			offsetBeforeZoom = undefined;
			zoomFinalOffset = undefined;
			finalZoomFactor = undefined;
		}
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
		needsWebGLDraw = true;
	}
	
	function startZoomOut() {
		// don't allow more than one zoom at a time.
		if (zoomScaleTime !== undefined)
			return;
		scaleFactorBeforeZoom = scaleFactor;
		finalZoomFactor = scaleFactor / 0.4;
		zoomScaleTime = new Date().getTime();
		offsetBeforeZoom = centreOffset;
		if (zoomOffsets.length > 0)
			zoomFinalOffset = zoomOffsets.pop();
		else
			zoomFinalOffset = [0,0];
	}
	
	function drawHighQuality() {
		// Don't needlessly draw in high quality.
		if (isDrawnHighQuality)
			return;
		var originalPixelStretch = pixelStretch;
		pixelStretch = 0.5;
		gl.uniform1i(locationOfIsSubpixelSampling, 1);
		drawWebGLGraphics(gl, true);
		gl.uniform1i(locationOfIsSubpixelSampling, 0);
		pixelStretch = originalPixelStretch;
	}

	var lastDrawTime;
	var pixelStretchTimings = {};
	
	function updatePixelStretchTimings() {
		var t = new Date().getTime();
		if (lastDrawTime !== undefined) {
			var tDelta = t - lastDrawTime.t;
			var ratio = 0.1;
			var ratio2 = 1 - ratio;
			if (pixelStretchTimings[pixelStretch] === undefined)
				pixelStretchTimings[pixelStretch] = tDelta;
			else
				pixelStretchTimings[pixelStretch] = tDelta * ratio + pixelStretchTimings[pixelStretch] * ratio2;
			if (pixelStretch >= 1) {
				var updated = false;
				// check if we should change the pixelStretch.
				if (pixelStretchTimings[pixelStretch] > 80) {
					pixelStretch++;
					updated = true;
				}
				else if (pixelStretchTimings[pixelStretch] < 20 && pixelStretch > 1) {
					pixelStretch--;
					updated = true;
				}
				if (updated)
					resized();
			}
		}
		lastDrawTime = {
			't': t,
			'pixelStretch': pixelStretch
		};
	}
	
	function drawWebGLGraphics(gl, isJulia) {
		needsWebGLDraw = false;
		isDrawnHighQuality = pixelStretch < 1;
		if (isJulia) {
			updatePixelStretchTimings();
			if (highresTimoutTimer)
				clearTimeout(highresTimoutTimer);
			if (pixelStretch < 1) {
				highresTimoutTimer = undefined;
			}
			else {
				highresTimoutTimer = setTimeout(drawHighQuality, 1000);
			}
		}
		gl.viewport(0, 0, w, h);
		gl.clearColor(0, 0, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	function drawGraphics() {
		updateZoom();
		updateScale();
		resized();

		if (needsWebGLDraw) {
			drawWebGLGraphics(gl, true);
		}
		else
			lastDrawTime = undefined;
		requestAnimationFrame(drawGraphics);
	}
	
	function getInitialScaleValue() {
		return 2.5 / Math.min(w, h);
	}
	
	function getScaleValue() {
		return scaleFactor * getInitialScaleValue();
	}
	
	function updateScale() {
		var scaleValue = getScaleValue(scaleFactor);
		gl.uniform1f(locationOfScale, scaleValue);
	}
	
	function getCentre() {
		var scaleValue = getScaleValue(scaleFactor);
		return [w / 2 - centreOffset[0] / scaleValue, h / 2 - centreOffset[1] / scaleValue];
	}

	// called every time the window resizes or pixelStretch is changed.
	function resized() {
		var newW = window.innerWidth;
		var newH = window.innerHeight;

		newW /= pixelStretch;
		newH /= pixelStretch;
		
		canvas.setAttribute('width', Math.round(newW));
		canvas.setAttribute('height', Math.round(newH));
		if (w !== newW || h !== newH) {
			needsWebGLDraw = true;
			w = newW;
			h = newH;
		}
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

	resized();
	window.addEventListener('resize', resized);
	needsWebGLDraw = true;
	drawGraphics();
	document.getElementById('ok-button').addEventListener('click', okClicked);
	canvas.addEventListener('click', zoomInClick);
	canvas.addEventListener('touchstart', zoomInClick);
	window.addEventListener('keydown', keyDown);
});