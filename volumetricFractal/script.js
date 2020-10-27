"use strict"

/*
Written by Josh Greig around October 17, 2020.
*/

window.addEventListener("DOMContentLoaded", function() {
  let showSphereOutlineInput = document.getElementById('show-outline');
  let canvas = document.querySelector('#main-canvas');
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let pid = gl.createProgram();
  var h = canvas.clientHeight;
  var w = canvas.clientWidth;
  loadShaders(gl, pid);
  let locationOfCentre = gl.getUniformLocation(pid, "centre");
  let locationOfPosition = gl.getUniformLocation(pid, "position3D");
  let locationOfViewRotation = gl.getUniformLocation(pid, "viewRotation");
  let locationOfScale = gl.getUniformLocation(pid, "scale");
  let locationOfDisplayMode = gl.getUniformLocation(pid, "displayMode");
  let locationOfPlaneCutValue = gl.getUniformLocation(pid, "planeCutValue");
  let locationOfPlaneCutAxis = gl.getUniformLocation(pid, "planeCutAxis");
  let locationOfCircleRadiusRange = gl.getUniformLocation(pid, "circleRadiusRange");
  let locationOfShowingCircumference = gl.getUniformLocation(pid, "isShowingCircumference");
  let locationOfOpacityCutOff = gl.getUniformLocation(pid, "opacityCutOff");
  let locationOfAmbient = gl.getUniformLocation(pid, "ambientFactor");
  let rotationAngle = 0;
  let scaleValue = 100;
  var planeCutValue = document.getElementById('plane-cut-value');
  var peakOpacityInput = document.getElementById('peak-opacity');
  var cRealInput = document.getElementById('c-real');
  let pixelStretch = 3; 
  // start fairly low quality to safely know we won't crash the browser to start with.
  
  var ambientInput = document.getElementById('ambient');
  var positionY = 0;

	initCoords(gl, pid);
  var scaleFactor = 1;
  var lineThicknessFactor = 0.001;
  var times = [];
  var rotationRadius = 2.0;
  var deltaT = document.getElementById('deltaT');
  var oldMouseX, oldMouseY, oldTouchX, oldTouchY;
  const DEFAULT_DISPLAY_MODE = 1;
  const PLANE_CUT_DISPLAY_MODE = 2;
  const MAX_CUT_VOLUME_DISPLAY_MODE = 3;
  const MIN_CUT_VOLUME_DISPLAY_MODE = 4;

	// This is important for managing browser view zoom.
	// A zoom other than 100% causes canvas.clientWidth != viewport width.
	function getViewportDimensions() {
		var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);	
		return [vw, vh];
	}

	class MandelbrotDisplay {
		constructor() {
			this.div = document.getElementById('mandelbrot-display');
			this.canvas = this.div.querySelector('canvas');
			this.g = this.canvas.getContext('2d');
			var info = this._createWebGLCanvas();
			Object.assign(this, info);
			var outer = this;
			document.addEventListener('sphere-radius-change', function() {
				outer.sphereRadiusChanged();
			});
			this.isVisible = false;
			this.updateVisibility();
		}
		
		_createWebGLCanvas() {
			var result = {};
			result.canvasWebGL = document.createElement('canvas');
			var options = {
				'preserveDrawingBuffer': false
			};
			result.gl = result.canvasWebGL.getContext('webgl', options) || result.canvasWebGL.getContext('experimental-webgl', options);
			result.pid = result.gl.createProgram();
			this.loadShaders(result.gl, result.pid);
			initCoords(result.gl, result.pid);
			result.uniforms = {};
			var uniformKeys = ['centre', 'fractalIterationDelta',
				'pixelSubsampling', 'scale'];
			uniformKeys.forEach(function(key) {
				result.uniforms[key] = result.gl.getUniformLocation(result.pid, key);
			});
			return result;
		}

		loadShaders(gl, pid) {
			shader(gl, pid, 'script[type="glsl/vertex"]', gl.VERTEX_SHADER);
			shader(gl, pid, '#mandelbrot-fragment-shader', gl.FRAGMENT_SHADER);
			gl.linkProgram(pid);
			gl.useProgram(pid);
		}
		
		_getScaleFrom(w, h) {
			var r = 2;
			if (sphereRadius !== undefined)
				r = sphereRadius.getValue();
			return getScaleFromDimensions(w, h) * 0.8 * r / 2.0;
		}

		_drawMandelbrot(glDestination, pidDestination, w, h, uniforms) {
			this.scale = this._getScaleFrom(w, h);
			glDestination.uniform1i(uniforms.pixelSubsampling, 2);
			glDestination.uniform1f(uniforms.scale, this.scale);
			glDestination.uniform2fv(uniforms.centre, [w/2, h/2]);
			['fractalIterationDelta'].forEach(function(key) {
				copyUniform(gl, glDestination, pid, pidDestination, key);
			});
			drawGraphics(glDestination, w, h);
		}
		
		shouldBeVisible() {
			// would this mandelbrot display overlap the sphere?
			var dimensions = getViewportDimensions();
			var w = dimensions[0];
			var h = dimensions[1];
			var size = this._getSizeFromFullCanvas(w, h);
			var scaleValue = getScaleFromDimensions(w, h);
			var radius = getMaxCircleRadius(w, h, scaleValue);
			var centre = getCentre();
			centre = [centre[0] * pixelStretch, centre[1] * pixelStretch];
			var x = size;
			var y = h - size;
			var dx = centre[0] - x;
			var dy = centre[1] - y;
			return Math.sqrt(dx * dx + dy * dy) > radius;
		}

		updateVisibility() {
			var shouldShow = this.shouldBeVisible();
			if (shouldShow !== this.isVisible) {
				this.isVisible = shouldShow;
				if (shouldShow) {
					this.div.style.display = 'block';
					this.updateSize();
				}
				else {
					this.div.style.display = 'none';
				}
				return true;
			}
			return false;
		}
		
		cRealUpdated() {
			this._drawCRealAndDot();
		}
		
		planeCutValueUpdated() {
			this._drawCRealAndDot();
		}
		
		planeCutAxisChanged() {
			this._drawCRealAndDot();
		}
		
		sphereRadiusChanged() {
			if (!this.updateVisibility())
				this._drawAll();
		}
		
		maxIterationsChanged() {
			this._drawAll();
		}

		_replaceWebGLImage() {
			this.latestImgLoaded = false;
			this.latestImg = new Image();
			var dataURL = this.canvasWebGL.toDataURL('image/png', 1.0);
			var outer = this;
			this.latestImg.addEventListener('load', function() {
				outer.latestImgLoaded = true;
			});
			this.latestImg.src = dataURL;
		}

		// The callback function is to simulate an async function.
		// I just don't want this to break if the browser doesn't 
		// support keywords like async and await.
		_copyWebGLCanvas(successCallback) {
			var outer = this;
			if (this.latestImgLoaded) {
				outer.g.drawImage(outer.latestImg, 0, 0);
				if (successCallback)
					successCallback();
			}
			else
			this.latestImg.addEventListener('load', function() {
				outer.g.drawImage(outer.latestImg, 0, 0);
				if (successCallback)
					successCallback();
			});
		}
		
		_drawLineAndDot(g, scale, w, h, offsetY) {
			var rv = getCRealValue();
			rv = (rv / scale) + w / 2;
			var lineThickness = 0.03 / scale;
			var circleRadius = 0.05 / scale;
			g.fillStyle = '#fff';
			g.strokeStyle = '#000';
			g.lineWidth = 0.01 / scale;
			g.beginPath();
			g.rect(rv - lineThickness * 0.5, offsetY, lineThickness, h);
			g.closePath();
			g.fill();
			g.stroke();
			
			// if the cut plane is showing and the axis is z, show a dot.
			if (isPlaneCut() && getPlaneCutAxisValue() === 3 && circleRadius > 0) {
				var mandelbrotY = offsetY + getPlaneCutValue() / scale + h / 2;
				g.fillStyle = '#00f';
				g.beginPath();
				g.arc(rv, mandelbrotY, circleRadius, 0, Math.PI * 2);
				g.closePath();
				g.fill();
				g.stroke();
			}
		}

		_drawCRealAndDot() {
			if (!this.isVisible) {
				return; // don't waste time if it won't show.
			}
			var outer = this;
			this._copyWebGLCanvas(function() {
				outer._drawLineAndDot(outer.g, outer.scale, outer.w, outer.h, 0);
			});
		}
		
		_drawAll() {
			this._drawMandelbrot(this.gl, this.pid, this.w, this.h, this.uniforms);
			this.gl.finish();
			this._replaceWebGLImage();
			this._drawCRealAndDot();
		}

		// Used for high quality download.
		drawAll(canvas) {
			// draw mandelbrot
			var outer = this;
			return new Promise(function(resolve, reject) {
				var w = canvas.getAttribute('width');
				var h = canvas.getAttribute('height');
				var size = outer._getSizeFromFullCanvas(w, h);
				var info = outer._createWebGLCanvas();

				info.canvasWebGL.setAttribute('width', size);
				info.canvasWebGL.setAttribute('height', size);
				outer._drawMandelbrot(info.gl, info.pid, size, size, info.uniforms);

				var latestImg = new Image();
				var dataURL = info.canvasWebGL.toDataURL('image/png', 1.0);
				latestImg.addEventListener('load', function() {
					var g = canvas.getContext('2d');
					g.drawImage(latestImg, 0, h - size);
					var scale = outer._getScaleFrom(size, size);
					// draw the line and dot.
					outer._drawLineAndDot(g, scale, size, size, h - size);

					// Free up the context, if the extension is supported.
					var ext = info.gl.getExtension('WEBGL_lose_context');
					if (typeof ext === 'object' && typeof ext.loseContext === 'function') {
						info.gl.getExtension('WEBGL_lose_context').loseContext();
					}
					
					resolve();
				});
				latestImg.src = dataURL;
			});
		}

		_getSizeFromFullCanvas(w, h) {
			return Math.round(Math.min(w, h) * 0.3);
		}

		updateSize() {
			if (!this.isVisible || this.updateVisibility()) {
				return; // don't waste time if it won't show.
			}
			var dimensions = getViewportDimensions();
			var size = this._getSizeFromFullCanvas(dimensions[0], dimensions[1]);
			var s = size + 'px';
			[this.div, this.canvas].forEach(function(e) {
				e.style.height = s;
				e.style.width = s;
			});
			this.w = size;
			this.h = size;
			[this.canvasWebGL, this.canvas].forEach(function(c) {
				c.setAttribute('width', size);
				c.setAttribute('height', size);
			});
			this._drawAll();
		}
	}

	class DownloadRenderer {
		constructor() {
			this.filename = 'cloud.png';
			this.downloadBar = document.getElementById('render-and-download-progress');
			this.progressBar = document.getElementById('download-progress-bar');
			this.downloadButton = document.getElementById('download-image');
			var outer = this;
			this.downloadButton.addEventListener('click', function() {
				outer.startDownload();
			});

			this.isRenderingOrDownloading = false;
			this.canvas2D = document.createElement('canvas');
			this.g = this.canvas2D.getContext('2d');
			this.canvasWebGL = document.createElement('canvas');
			this.gl = this.canvasWebGL.getContext('webgl', {
				'preserveDrawingBuffer': false
			});
			this.pid = this.gl.createProgram();
			loadShaders(this.gl, this.pid);
			initCoords(this.gl, this.pid);
			this.uniforms = this.getUniforms([
				'ambientFactor', 'centre', 'circleRadiusRange', 'cReal',
				'fractalIterationDelta', 'isShowingCircumference', 'displayMode',
				'lightDirection', 'lightObstructionDeltaRatio', 'opacityCutOff', 'peakSampleOpacity',
				'pixelSubsampling', 'planeCutValue', 'planeCutAxis',
				'position3D', 'scale', 
				'sphereRadius', 'sphereRadiusSquared',
				'sphereRadiusWithPlaneLineSquared',
				'viewRotation'
			]);
		}
		
		getUniforms(keys) {
			var result = {};
			var outer = this;
			keys.forEach(function(key) {
				result[key] = outer.gl.getUniformLocation(outer.pid, key);
			});
			return result;
		}
		
		_showDownloadProgress() {
			this.downloadBar.setAttribute('class', 'shown');
		}
		
		_hideDownloadProgress() {
			this.downloadBar.setAttribute('class', '');
		}
		
		_updateProgress() {
			this.progressBar.setAttribute('value', 100.0 * this.left / this.w);
		}
		
		_fillBlackBackground(g, w, h) {
			g.fillStyle = '#000';
			g.beginPath();
			g.rect(0, 0, w, h);
			g.closePath();
			g.fill();
		}
		
		download(filename) {
			this.filename = filename;
			var outer = this;
			var promise = new Promise(function(resolver, rejecter) {
				outer.downloadCompleteCallback = function() {
					outer.downloadCompleteCallback = undefined;
					outer.filename = 'cloud.png';
					resolver();
				};
				outer.startDownload();
			});
			return promise;
		}

		startDownload() {
			this._showDownloadProgress();
			this.w = 1920;
			this.h = 1080;
			var lightObstructionDeltaRatio = 0.02;
			this.isRenderingOrDownloading = true;
			this.canvas2D.setAttribute('width', this.w);
			this.canvas2D.setAttribute('height', this.h);
			var scaleValue = getScaleFromDimensions(this.w, this.h);
			this.gl.uniform1f(this.uniforms.scale, scaleValue);
			var maxPixelRadius = updateCircleRadiusRange(this.gl, this.w, this.h, scaleValue, this.uniforms.circleRadiusRange);
			var pixelSubsamplingQuality = pixelSubsampling.DEFAULT_QUALITY;
			if (isPlaneCut())
				pixelSubsamplingQuality = 7;
			this.gl.uniform1i(this.uniforms.pixelSubsampling, pixelSubsamplingQuality);
			this.gl.uniform2fv(this.uniforms.centre, [this.w / 2, this.h / 2]);
			this.gl.uniform1f(this.uniforms.scale, getScaleFromDimensions(this.w, this.h));
			this.gl.uniform1f(this.uniforms.lightObstructionDeltaRatio, lightObstructionDeltaRatio);
			var peakSampleOpacity = getPeakOpacityForLightObstructionDeltaRatio(lightObstructionDeltaRatio);
			this.gl.uniform1f(this.uniforms.peakSampleOpacity, peakSampleOpacity);
			this.gl.uniform1f(this.uniforms.opacityCutOff, getOpacityCutOffFromPeakSampleOpacity(peakSampleOpacity));
			
			sphereRadius.updateUniforms(this.gl, this.w, this.h, this.uniforms.sphereRadiusSquared,
				this.uniforms.sphereRadiusWithPlaneLineSquared);
			var outer = this;
			['ambientFactor', 'cReal', 'fractalIterationDelta',
			'isShowingCircumference', 'displayMode',
			'lightDirection',
			'planeCutAxis', 'planeCutValue', 'sphereRadiusSquared',
			'sphereRadiusWithPlaneLineSquared', 'position3D', 'viewRotation'].forEach(function(key) {
				copyUniform(gl, outer.gl, pid, outer.pid, key);
			});
			this._fillBlackBackground(this.g, this.w, this.h);
			this.left = Math.floor(Math.max(0, this.w / 2 - maxPixelRadius));
			this.maxToRender = Math.ceil(Math.min(this.w, this.w / 2 + maxPixelRadius));
			this.intervalSize = 5;
			this.canvasWebGL.setAttribute('width', this.intervalSize);
			this.canvasWebGL.setAttribute('height', this.h);
			requestAnimationFrame(function() {
				outer.updateDrawing();
			});
		}
		
		updateDrawing() {
			if (this.updateLoopStartTime === undefined) {
				this.updateLoopStartTime = new Date().getTime();
			}
			this.gl.uniform2fv(this.uniforms.centre, [this.w / 2 - this.left, this.h / 2]);
			drawGraphics(this.gl, this.intervalSize, this.h);
			var dataURL = this.canvasWebGL.toDataURL("image/png", 1.0);
			var img = new Image();
			var outer = this;
			img.onload = function() {
				outer.g.drawImage(img, outer.left, 0);
				if (outer.left + outer.intervalSize >= outer.maxToRender) {
					if (mandelBrotDisplay.shouldBeVisible())
						mandelBrotDisplay.drawAll(outer.canvas2D).then(function() {
							outer.downloadCanvas();
						});
					else
						outer.downloadCanvas();
				}
				else {
					outer.left += outer.intervalSize;
					var newTime = new Date().getTime();
					var maxLoopTime = 50;
					if (newTime - outer.updateLoopStartTime > maxLoopTime) {
						outer._updateProgress();
						this.updateLoopStartTime = undefined;
						requestAnimationFrame(function() {
							outer.updateDrawing();
						});
					}
					else {
						// no delay.  continue immediately so the 
						// render completes faster.
						outer.updateDrawing();
					}
				}
			}
			img.src = dataURL;
		}
		
		downloadCanvas() {
			var outer = this;
			this.canvas2D.toBlob(function(blob) {
				saveAs(blob, outer.filename);
				outer.isRenderingOrDownloading = false;
				outer._hideDownloadProgress();
				if (typeof outer.downloadCompleteCallback === 'function') {
					outer.downloadCompleteCallback();
				}
			}, 'image/png', 0.99);
		}

		isDownloading() {
			return this.isRenderingOrDownloading;
		}
	}

	class LightObstructionDelta {
		constructor() {
			this.LOWEST_QUALITY = 0.3;
			this.LOWEST_1_PIXELSTRETCH_QUALITY = 0.2;
			this.DEFAULT_QUALITY = 0.1;
			this.DOWNLOAD_QUALITY = 0.01;
			this.ratio = this.DEFAULT_QUALITY;
			this.uniformLocation = gl.getUniformLocation(pid, "lightObstructionDeltaRatio");
			this._ratioUpdated();
			var outer = this;
			peakOpacityInput.addEventListener('input', function() {
				outer.peakOpacityInputChanged();
			});
		}
		
		peakOpacityInputChanged() {
			this._ratioUpdated();
		}
		
		_ratioUpdated() {
			if (typeof this.ratio !== 'number' || isNaN(this.ratio) || this.ratio < this.DOWNLOAD_QUALITY) {
				throw new Error('Invalid ratio: ' + this.ratio);
			}
			sampleOpacity.setValueFromLightObstructionRatio(this.ratio);
			gl.uniform1f(this.uniformLocation, this.ratio);
		}
		
		decreaseQuality() {
			if (this.ratio < this.DEFAULT_QUALITY) {
				this.ratio = this.DEFAULT_QUALITY;
			}
			else if (this.ratio < this.LOWEST_1_PIXELSTRETCH_QUALITY) {
				this.ratio = this.LOWEST_1_PIXELSTRETCH_QUALITY;
			}
			else {
				this.ratio = this.LOWEST_QUALITY;
			}
			this._ratioUpdated();
		}
		
		increaseQuality() {
			if (this.ratio > this.DEFAULT_QUALITY)
				this.ratio = this.DEFAULT_QUALITY;
			else
				this.ratio = Math.max(this.DOWNLOAD_QUALITY, this.ratio * 0.9);
			this._ratioUpdated();
		}

		isLowestQuality() {
			return this.ratio >= this.LOWEST_QUALITY - 0.0001;
		}
		
		isLowest1PixelStretchQuality() {
			return this.ratio >= this.LOWEST_1_PIXELSTRETCH_QUALITY - 0.0001;
		}
		
		setToDefaultQuality() {
			this.ratio = this.DEFAULT_QUALITY;
			this._ratioUpdated();
		}

		setToLowestQuality() {
			this.ratio = this.LOWEST_QUALITY;
			this._ratioUpdated();
		}
		
		setToDownloadQuality() {
			this.ratio = this.DOWNLOAD_QUALITY;
			this._ratioUpdated();
		}
	}

	class PixelSubsampling {
		constructor() {
			this.DEFAULT_QUALITY = 1;
			this.DOWNLOAD_QUALITY = 2;
			this.MAX_QUALITY = 5;
			this.value = this.DEFAULT_QUALITY;
			this.locationOfPixelSubsampling = gl.getUniformLocation(pid, "pixelSubsampling");
			this._valueUpdated();
		}
		
		_valueUpdated() {
			gl.uniform1i(this.locationOfPixelSubsampling, this.value);
		}
		
		useLowestQuality() {
			this.value = this.DEFAULT_QUALITY;
			this._valueUpdated();
		}
		
		decreaseQuality() {
			this.value = Math.max(this.DEFAULT_QUALITY, this.value - 1);
			this._valueUpdated();
		}
		
		increaseQuality() {
			this.value = Math.min(this.MAX_QUALITY, this.value + 1);
			this._valueUpdated();
		}
	}

	class SphereRadius {
		constructor() {
			this.sphereRadiusInput = document.getElementById('sphere-radius');
			this.locationOfSphereRadiusSquared = gl.getUniformLocation(pid, "sphereRadiusSquared");
			this.locationOfSphereRadiusWithPlaneLineSquared = gl.getUniformLocation(pid, "sphereRadiusWithPlaneLineSquared");
			let outer = this;
			this.sphereRadiusInput.addEventListener('input', function() {
				outer._updated();
			});
			this._updated();
		}
		
		updateUniforms(gl, w, h, locationOfSphereRadiusSquared,
			locationOfSphereRadiusWithPlaneLineSquared) {
			let val = sanitizeFloat(this.sphereRadiusInput.value, 2);
			let val2 = val * (1 + getOutlineThickness(w, h) * scaleValue);
			gl.uniform1f(locationOfSphereRadiusSquared, val * val);
			gl.uniform1f(locationOfSphereRadiusWithPlaneLineSquared, val2 * val2);
		}

		_updated() {
			let val = this.getValue();
			this.updateUniforms(gl, w, h, this.locationOfSphereRadiusSquared, 
				this.locationOfSphereRadiusWithPlaneLineSquared);
			planeCutValue.setAttribute('min', -val);
			planeCutValue.setAttribute('max', val);
			planeCutValue.value = Math.max(-val, Math.min(val, getPlaneCutValue()));
			document.dispatchEvent(new Event('sphere-radius-change'));
		}

		getValue() {
			return sanitizeFloat(this.sphereRadiusInput.value, 2);
		}
		
		setValue(newValue) {
			// For efficiency's sake, check that the value actually changed.
			if (newValue !== this.getValue()) {
				this.sphereRadiusInput.value = newValue;
				this._updated();
			}
		}
	}
	
	function getPeakOpacityForLightObstructionDeltaRatio(lightObstructionDeltaRatio) {
		return lightObstructionDeltaRatio * getPeakOpacityInputValue();
	}
	
	function copyUniform(glFrom, glDestination, pidFrom, pidDestination, key) {
		var locationOfUniform = glFrom.getUniformLocation(pidFrom, key);
		var destinationOfUniform = glDestination.getUniformLocation(pidDestination, key);
		if (!locationOfUniform) {
			console.log('Weird.  Not found: ' + key + ', locationOfUniform: ', locationOfUniform);
		}
		var val = gl.getUniform(pid, locationOfUniform);
		if (key === 'fractalIterationDelta') {
			console.log('copying fractalIntervalDelta of ' + val);
		}
		var uniformFunc;
		if (typeof val === 'boolean') {
			uniformFunc = glDestination.uniform1i;
		}
		else if (typeof val === 'number') {
			if (Math.floor(val) !== val || [
			'cReal', 'sphereRadiusSquared', 'peakSampleOpacity', 'planeCutValue', 
			'fractalIterationDelta', 'scale', 'ambientFactor', 'sphereRadiusWithPlaneLineSquared'
			].indexOf(key) !== -1)
				uniformFunc = glDestination.uniform1f;
			else
				uniformFunc = glDestination.uniform1i;
		}
		else if (val instanceof Float32Array) {
			if (val.length === 2)
				uniformFunc = glDestination.uniform2fv;
			else
				uniformFunc = glDestination.uniform3fv;
		}
		else {
			throw new Error('Unrecognized uniform type for: ', val);
		}
		console.log('got uniform method: ' + uniformFunc + ' for ' + key);
		uniformFunc.call(glDestination, destinationOfUniform, val);
	}
	
	class SampleOpacity {
		constructor() {
			this.locationOfPeakSampleOpacity = gl.getUniformLocation(pid, 'peakSampleOpacity');
			this.lightObstructionRatio = 0.3;
			this.setValueFromLightObstructionRatio(0.3);
		}

		_updated() {
			var newOpacity = getPeakOpacityForLightObstructionDeltaRatio(this.lightObstructionRatio);
			gl.uniform1f(this.locationOfPeakSampleOpacity, newOpacity);
			gl.uniform1f(locationOfOpacityCutOff, getOpacityCutOffFromPeakSampleOpacity(newOpacity));
		}
		
		setValueFromLightObstructionRatio(lightObstructionRatio) {
			this.lightObstructionRatio = lightObstructionRatio;
			this._updated();
		}
	}

  var mandelBrotDisplay = new MandelbrotDisplay();
  resized();
  var downloader = new DownloadRenderer();
  var sampleOpacity = new SampleOpacity();
  var sphereRadius = new SphereRadius();
  var lightObstructionDeltaRatio = new LightObstructionDelta();
  var pixelSubsampling = new PixelSubsampling();

	function initCoords(gl, pid) {
	 let coords = gl.getAttribLocation(pid, 'coords');
	  let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
	  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

	  gl.vertexAttribPointer(coords, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
	  gl.enableVertexAttribArray(coords);
	}

	function setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, newValue) {
	  gl.uniform1i(locationOfShowingCircumference, newValue);
	}

	function showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h) {
		  setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, !!showSphereOutlineInput.checked);
	}

	function sanitizeFloat(v, defaultVal) {
		if (typeof v === 'string') {
			v = v.trim();
			v = parseFloat(v);
		}
		if (typeof v !== 'number' || isNaN(v))
			return defaultVal;
		else
			return v;
	}
	
	function getPeakOpacityInputValue() {
		return sanitizeFloat(peakOpacityInput.value, 2.0);
	}
	
	function setPeakOpacityInputValue(newValue, forceChange) {
		var val = getPeakOpacityInputValue();
		if (forceChange || val !== newValue) {
			peakOpacityInput.value = newValue;
			lightObstructionDeltaRatio.peakOpacityInputChanged();
		}
	}

	function getOpacityCutOffFromPeakSampleOpacity(newOpacity) {
		return 0.05 * newOpacity;
	}
	
	function getScaleFromDimensions(w, h) {
		return 7.0 * scaleFactor / (w + h);
	}
	
	// returns value to be used in shader's uniform.
	// In other words, this isn't returning pixel coordinates.
	// You need the multiply the values by pixelStretch to get the pixel coordinates.
	function getCentre() {
	  var cy = h / 2;
	  var body = document.querySelector('body');
	  var bodyClass = body.class;
	  if (!bodyClass)
		bodyClass = '';

	  // if the settings are showing and it is more than 0.3 * h,
	  // look for a better cy.
	  if (bodyClass.indexOf('settings-collapsed') === -1 && sphereRadius !== undefined) {
		  var settings = document.getElementById('settings');
		  var settingsHeight = settings.clientHeight / pixelStretch;
		  if (settingsHeight > 0.3 * h) {
			  	var r = sphereRadius.getValue();
				if (r < 0.9 * rotationRadius && r < 0.5 * h) {
					r = getRadiusFromSphereRadius(r, scaleValue);
					var remainingHeight = h - settingsHeight;
					if (remainingHeight > r * 2) {
						cy = remainingHeight / 2;
					}
				}
		  }
	  }
	  return [w / 2, cy];
	}

  function updateCentre() {
	  var newCentre = getCentre();
	  gl.uniform2fv(locationOfCentre, newCentre);
	  mandelBrotDisplay.updateVisibility();
  }
  
  function refreshPixelStretchCentreAndScale() {
	  w = window.innerWidth;
	  h = window.innerHeight;
	  
	  w /= pixelStretch;
	  h /= pixelStretch;
	  updateCentre();
	  
	  canvas.setAttribute('width', Math.round(w));
	  canvas.setAttribute('height', Math.round(h));
	  scaleValue = getScaleFromDimensions(w, h);
	  console.log('scaleValue updating to ' + scaleValue);
	  gl.uniform1f(locationOfScale, scaleValue);
  }
  
  function resized() {
	  refreshPixelStretchCentreAndScale();
	  mandelBrotDisplay.updateSize();
  }

  function setPixelSubsampling(newValue) {
	isPixelSubsampling = newValue;
	gl.uniform1i(locationOfIsPixelSubsampling, newValue);
  }

  function setRotationAngle(newAngle) {
	var a = Math.PI + newAngle;
	gl.uniform2fv(locationOfViewRotation, [Math.cos(a), Math.sin(a)]);
	gl.uniform3fv(locationOfPosition, [rotationRadius * Math.sin(newAngle), positionY, rotationRadius * Math.cos(newAngle)]);
  }
  
  function getDisplayMode() {
	  var input = document.querySelector('[name="display-mode"]:checked');
	  return parseInt(input.value);
  }
  
  function setDisplayMode(newDisplayMode, forceUpdate) {
	  var currentValue = getDisplayMode();
	  if (forceUpdate || currentValue !== newDisplayMode) {
		  var id = 'display-mode-volume';
		  if (newDisplayMode === PLANE_CUT_DISPLAY_MODE)
			  id = 'display-mode-plane-cut';
		  else if (newDisplayMode === MAX_CUT_VOLUME_DISPLAY_MODE)
			  id = 'display-mode-max-cut-volume';
		  else if (newDisplayMode === MIN_CUT_VOLUME_DISPLAY_MODE)
			  id = 'display-mode-min-cut-volume';

		  if (currentValue !== newDisplayMode) {
			  var input = document.getElementById(id);
			  input.checked = true;
			  if (newValue !== val && newMode !== PLANE_CUT_DISPLAY_MODE) {
				// volumetric rendering can't run at the same quality.
				// prevent the browser from crashing.
				decreaseQuality(1);
			  }
		  }
		  gl.uniform1i(locationOfDisplayMode, newDisplayMode);
	  }
  }

  function isPlaneCut() {
	  return getDisplayMode() === PLANE_CUT_DISPLAY_MODE;
  }

  function decreaseQuality(currentFrameRate) {
	  if (isPlaneCut()) {
		if (pixelStretch === 1)
			pixelSubsampling.decreaseQuality();
		else
			pixelSubsampling.useLowestQuality();
	  }
	  if (pixelStretch === 1 && !isPlaneCut() && !lightObstructionDeltaRatio.isLowest1PixelStretchQuality()) {
		  
		lightObstructionDeltaRatio.decreaseQuality();
		
		// If the frame rate is terrible, increase pixelStretch immediately.
		if (currentFrameRate < 5) {
				pixelStretch++;
				refreshPixelStretchCentreAndScale();
		}
		else {
			pixelStretch++;
			refreshPixelStretchCentreAndScale();
		}
	  }
	  else {
		pixelStretch++;
		refreshPixelStretchCentreAndScale();
	  }
  }

  function increaseQuality(currentFrameRate) {
	  if (pixelStretch > 1) {
			pixelStretch--;
			refreshPixelStretchCentreAndScale();
	  }
	  else if (!isPlaneCut()) {
		  lightObstructionDeltaRatio.increaseQuality();
	  }
	  else {
		  if (currentFrameRate > 55) {
			pixelSubsampling.increaseQuality();
		  }
	  }
  }

  function improveFrameRateInResponseTo(currentFrameRate) {
	  if (currentFrameRate < 20) {
		  decreaseQuality(currentFrameRate);
	  }
	  else if (currentFrameRate > 50) {
		  increaseQuality(currentFrameRate);
	  }
  }

  function processTimeChange() {
	document.dispatchEvent(new CustomEvent('time-changed', {}));
	var t = new Date().getTime();
	times = times.filter(function(time1) {
	  return t - time1 < 1000;
	});
	if (times.length > 0 && Math.floor(times[times.length - 1] / 3000) !== Math.floor(t / 3000)) {
		improveFrameRateInResponseTo(times.length);
	}
	times.push(t);
	setRotationAngle(rotationAngle);
  }
  
  function getOutlineThickness(w, h) {
	  return (w + h) * lineThicknessFactor;
  }
  
  function getRadiusFromSphereRadius(sr, scaleValue) {
		var sinA = sr / rotationRadius;
		var a = Math.asin(sinA);
		var rad = Math.tan(a) / scaleValue;
		return rad;
  }
  
  function getCircleRadius(w, h, scaleValue) {
	var r = 2;
	if (sphereRadius)
		r = sphereRadius.getValue();
	if (r > 0.97 * rotationRadius) {
		return sanitizeFloat(w + h, 18000);
	}
	else {
		return getRadiusFromSphereRadius(r, scaleValue);
	}
  }
  
  function getMaxCircleRadius(w, h, scaleValue) {
	var r = 2;
	if (sphereRadius)
		r = sphereRadius.getValue();
	var min = getCircleRadius(w, h, scaleValue);
	if (r > 0.97 * rotationRadius) {
		return min;
	}
	else {
		var max = getRadiusFromSphereRadius(r * (1 + getOutlineThickness(w, h) * scaleValue), scaleValue);
		return max;
	}
  }

  function updateCircleRadiusRange(gl, w, h, scaleValue, locationOfCircleRadiusRange, locationOfShowingCircumference) {
	var r = sphereRadius.getValue();
	var min = getCircleRadius(w, h, scaleValue);
	var max = getMaxCircleRadius(w, h, scaleValue);
	if (r > 0.97 * rotationRadius) {
		setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, false);
	}
	else {
		showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h);
		gl.uniform2fv(locationOfCircleRadiusRange, [min, max]);
	}
	gl.uniform2fv(locationOfCircleRadiusRange, [min, max]);
	return max;
  }
  
  function drawGraphics(gl, w, h) {
	gl.viewport(0, 0, w, h);
	gl.clearColor(0, 0, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function draw() {
	  if (!downloader.isDownloading()) {
		processTimeChange();
		updateCircleRadiusRange(gl, w, h, scaleValue, locationOfCircleRadiusRange);
		drawGraphics(gl, w, h);
	  }
	requestAnimationFrame(draw);
  }
  
  function loadShaders(gl, pid) {
	  shader(gl, pid, 'script[type="glsl/vertex"]', gl.VERTEX_SHADER);
	  shader(gl, pid, '#main-fragment-shader', gl.FRAGMENT_SHADER);
	  gl.linkProgram(pid);
	  gl.useProgram(pid);
  }

  function shader(gl, pid, cssSelector, type) {
    let src = document.querySelector(cssSelector).innerText;
    let sid = gl.createShader(type);
    gl.shaderSource(sid, src);
    gl.compileShader(sid);
    gl.attachShader(pid, sid);
  }
  
  function processDrag(dx, dy) {
	rotationAngle += dx * 0.002;
	rotationRadius += dy * 0.004;
	mandelBrotDisplay.updateVisibility();
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

  function getPlaneCutValue() {
	return sanitizeFloat(planeCutValue.value, 0);
  }

  function setPlaneCutValue(newValue, forceUpdate) {
	if (forceUpdate || newValue !== getPlaneCutValue()) {
		planeCutValue.value = newValue;
		gl.uniform1f(locationOfPlaneCutValue, newValue);
		mandelBrotDisplay.planeCutValueUpdated();
	}
  }
  
  function getPlaneCutAxisValue() {
		var checkedPlaneCutAxisInput = document.querySelector('[name="plane-cut-axis"]:checked');
		return parseInt(checkedPlaneCutAxisInput.value);
  }

	function setPlaneCutAxis(newPlaneCutAxis, forceUpdate) {
		var val = getPlaneCutAxisValue();
		if (forceUpdate || val !== newPlaneCutAxis) {
			if (val !== newPlaneCutAxis) {
				var planeCutAxisInput = document.querySelector('[name="plane-cut-axis"][value="' + newPlaneCutAxis + '"]');
				planeCutAxisInput.checked = true;
			}
			gl.uniform1i(locationOfPlaneCutAxis, newPlaneCutAxis);
			mandelBrotDisplay.planeCutAxisChanged();
		}
	}

  function getCRealValue() {
	return sanitizeFloat(cRealInput.value, 0.7);
  }
  
  function initPlaneCutSettings() {
		var lightSettings = document.getElementById('light-settings');
		var wideColumn = document.getElementById('wide-column');
		
		function displayModeUpdated() {
			if (!isPlaneCut()) {
				pixelSubsampling.useLowestQuality();
			}
			setDisplayMode(getDisplayMode(), true);
			if (getDisplayMode() !== DEFAULT_DISPLAY_MODE) {
				wideColumn.setAttribute('class', 'show-plane-cut-settings');
			}
			else {
				wideColumn.setAttribute('class', 'show-light-settings');
			}
			mandelBrotDisplay.planeCutAxisChanged();
		}

		function planeCutChanged() {
			setPlaneCutValue(getPlaneCutValue(), true);
		}
		
		function planeCutAxisChanged() {
			setPlaneCutAxis(getPlaneCutAxisValue(), true);
		}

		['volume', 'plane-cut', 'max-cut-volume', 'min-cut-volume'].forEach(function(displayModeName) {
			var input = document.getElementById('display-mode-' + displayModeName);
			input.addEventListener('change', displayModeUpdated);
		});
		planeCutValue.addEventListener('input', planeCutChanged);
		['x', 'y', 'z'].forEach(function(axisName) {
			var planeCutAxis = document.getElementById('plane-cut-axis-' + axisName);
			planeCutAxis.addEventListener('change', planeCutAxisChanged);
		});
		planeCutChanged();
		planeCutAxisChanged();
  }
  
  function setAmbientValue(newAmbientValue, forceUpdate) {
	  var val = sanitizeFloat(ambientInput.value);
	  if (newAmbientValue !== val || forceUpdate) {
		  gl.uniform1f(locationOfAmbient, 1 - newAmbientValue);
		  ambientInput.value = newAmbientValue;
	  }
  }

  function setLineThicknessFactor(newLineThicknessFactor) {
	  lineThicknessFactor = newLineThicknessFactor;
  }

  function initSettings() {
	var body = document.querySelector('body');
	var settingsCloseButton = document.getElementById('collapse-settings-button');
	var settingsExpandButton = document.getElementById('expand-settings-button');
	var maxIterationsInput = document.getElementById('max-iterations');
	var lightDirectionX = document.getElementById('light-x');
	var lightDirectionY = document.getElementById('light-y');
	var lightDirectionZ = document.getElementById('light-z');
	let locationOfFractalIterationDeltas = gl.getUniformLocation(pid, "fractalIterationDelta");
	let locationOfLightDirection = gl.getUniformLocation(pid, "lightDirection");
	let locationOfCReal = gl.getUniformLocation(pid, "cReal");
	var animationDownloadButton = document.getElementById('downloadAnimationHD');

  function setCRealValue(newValue, forceUpdate) {
	  if (getCRealValue() !== newValue || forceUpdate) {
		cRealInput.value = newValue;
		gl.uniform1f(locationOfCReal, newValue);
		mandelBrotDisplay.cRealUpdated();
	  }
  }
	function lightDirectionChanged() {
		  var x = sanitizeFloat(lightDirectionX.value, 0);
		  var y = sanitizeFloat(lightDirectionY.value, 0);
		  var z = sanitizeFloat(lightDirectionZ.value, 0);
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

	function ambientChanged() {
		setAmbientValue(sanitizeFloat(ambientInput.value, 0.05), true);
	}
	
	function getMaxIterations() {
		var val = parseInt(maxIterationsInput.value);
		if (typeof val !== 'number' || isNaN(val))
			val = 20;
		return val;
	}
	
	function setMaxIterations(newMaxIterations, forceChange) {
		if (typeof newMaxIterations !== 'number' || isNaN(newMaxIterations))
			throw new Error('MaxIterations must be set to a number.  Not: ' + newMaxIterations);
		var val = getMaxIterations();
		if (val !== newMaxIterations || forceChange) {
			if (newMaxIterations > 300)
				throw new Error('MaxIterations can not be set to such a large number. ' + newMaxIterations);
			gl.uniform1f(locationOfFractalIterationDeltas, 1.0 / newMaxIterations);
			mandelBrotDisplay.maxIterationsChanged();
		}
		if (!forceChange) {
			maxIterationsInput.value = newMaxIterations;
		}
	}

	function maxIterationsChanged() {
		setMaxIterations(getMaxIterations(), true);
	}
	  
	  function cRealChanged() {
		  var val = getCRealValue();
		  gl.uniform1f(locationOfCReal, val);
		  mandelBrotDisplay.cRealUpdated();
	  }
	  
	  function settingsClose() {
		  body.setAttribute('class', 'settings-collapsed');
	  }
	  
	  function settingsExpand() {
		  body.setAttribute('class', '');
	  }
	  
	  function downloadAnimation() {
		  var animation = new Animation();
		  var fps = 60;
		  var frameIndex = 0;
		  
			function isFrameToSkip() {
				if (frameIndex < 4863)
					return true;
				
				return false;
			}

			function processTimeChange(deltaT) {
				var eventData = new CustomEvent('animation-update', {
					'detail': {
						'props': animation.getPropertiesForTime(deltaT),
						'deltaT': deltaT
						}
				});
				animationUpdated(eventData);
			}

			function getFormattedFrameIndex() {
				var result = '' + (frameIndex + 1);
				while (result.length < 8) {
					result = '0' + result;
				}
				return result;
			}

			function downloadFrame() {
				while (isFrameToSkip() && frameIndex * 1000 / fps < animation.getMaxTime()) {
					frameIndex++;
				}
				if (frameIndex * 1000 / fps > animation.getMaxTime()) {
					return;
				}
			  var frameName = 'cloud_frame_' + getFormattedFrameIndex() + '.png';
				var deltaT = frameIndex * 1000 / fps;
				processTimeChange(deltaT);
			  downloader.download(frameName).then(function() {
				  if (deltaT <= animation.getMaxTime()) {
					  frameIndex++;
						// continue downloading frames.
						// use setTimeout to give events a chance to be processed.
					  downloadFrame();
				  }
			  });
			}

			downloadFrame();
	  }
  
		function animationUpdated(event) {
		  if (event.detail) {
			  var uiSettings = event.detail.props.uiSettings;
			  rotationAngle = getDefaultedNumber(uiSettings.rotationAngle, rotationAngle);
			  rotationRadius = getDefaultedNumber(uiSettings.rotationRadius, rotationRadius);
			  sphereRadius.setValue(uiSettings.sphereRadius, sphereRadius.getValue());
			  setMaxIterations(getDefaultedInteger(uiSettings.maxIterations, getMaxIterations()));
			  setPlaneCutAxis(getDefaultedInteger(uiSettings.planeCutAxis, getPlaneCutAxisValue()), false);
			  setPeakOpacityInputValue(getDefaultedNumber(uiSettings.peakOpacity, getPeakOpacityInputValue()));
			  setPlaneCutValue(getDefaultedNumber(uiSettings.planeCutValue, getPlaneCutValue()));
			  setCRealValue(getDefaultedNumber(uiSettings.cReal, getCRealValue()));
			  setAmbientValue(getDefaultedNumber(uiSettings.ambient, sanitizeFloat(ambientInput.value, 0.05)));
			  positionY = getDefaultedNumber(uiSettings.positionY, positionY);
			  scaleFactor = getDefaultedNumber(uiSettings.scaleFactor, scaleFactor);
			  setDisplayMode(getDefaultedInteger(uiSettings.displayMode, getDisplayMode()));
			  setLineThicknessFactor(getDefaultedNumber(uiSettings.lineThicknessFactor, 0.001));

			  setRotationAngle(rotationAngle); // update based on rotationRadius and rotationAngle.
			  deltaT.innerText = event.detail.deltaT;
		  }
		}
	  
	  showSphereOutlineInput.addEventListener('change', function() {
		showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h);
	  });
	  [lightDirectionX, lightDirectionY, lightDirectionZ].forEach(function(input) {
		input.addEventListener('input', lightDirectionChanged);
	  });
	  animationDownloadButton.addEventListener('click', downloadAnimation);
	maxIterationsInput.addEventListener('input', maxIterationsChanged);
	cRealInput.addEventListener('input', cRealChanged);
	settingsCloseButton.addEventListener('click', settingsClose);
	settingsExpandButton.addEventListener('click', settingsExpand);
	ambientInput.addEventListener('input', ambientChanged);
	showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h);
	lightDirectionChanged();
	maxIterationsChanged();
	cRealChanged();
	ambientChanged();
	initPlaneCutSettings();
	document.addEventListener('animation-update', animationUpdated);
  }

  function getDefaultedNumber(val1, defaultVal) {
	if (typeof val1 === 'number' && !isNaN(val1))
		return val1;
	else
		return defaultVal;
  }
  
  function getDefaultedInteger(val1, defaultVal) {
	  return parseInt(getDefaultedNumber(val1, defaultVal));
  }
  
  function getDefaultedBool(val1, defaultVal) {
	if (typeof val1 === 'boolean')
		return val1;
	else
		return defaultVal;
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
  mandelBrotDisplay.updateSize();
});