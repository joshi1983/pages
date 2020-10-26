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
  let coords = gl.getAttribLocation(pid, "coords");
  let locationOfCentre = gl.getUniformLocation(pid, "centre");
  let locationOfPosition = gl.getUniformLocation(pid, "position3D");
  let locationOfViewRotation = gl.getUniformLocation(pid, "viewRotation");
  let locationOfScale = gl.getUniformLocation(pid, "scale");
  let locationOfIsShowingPlaneCut = gl.getUniformLocation(pid, "isShowingPlaneCut");
  let locationOfPlaneCutValue = gl.getUniformLocation(pid, "planeCutValue");
  let locationOfPlaneCutAxis = gl.getUniformLocation(pid, "planeCutAxis");
  let locationOfCircleRadiusRange = gl.getUniformLocation(pid, "circleRadiusRange");
  let locationOfShowingCircumference = gl.getUniformLocation(pid, "isShowingCircumference");
  let locationOfOpacityCutOff = gl.getUniformLocation(pid, "opacityCutOff");
  let rotationAngle = 0;
  let scaleValue = 100;
  var planeCutValue = document.getElementById('plane-cut-value');
  var peakOpacityInput = document.getElementById('peak-opacity');
  var cRealInput = document.getElementById('c-real');
  let pixelStretch = 3; 
  // start fairly low quality to safely know we won't crash the browser to start with.
  
  var ambientInput = document.getElementById('ambient');

	initCoords(gl, coords);
  var times = [];
  var rotationRadius = 2.0;
  var oldMouseX, oldMouseY, oldTouchX, oldTouchY;

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
			this.canvasWebGL = document.createElement('canvas');
			var options = {
				'preserveDrawingBuffer': false
			};
			this.gl = this.canvasWebGL.getContext('webgl', options) || this.canvasWebGL.getContext('experimental-webgl', options);
			this.pid = this.gl.createProgram();
			this.loadShaders(this.gl, this.pid);
			this.coords = this.gl.getAttribLocation(this.pid, 'coords');
			initCoords(this.gl, this.coords);
			this.uniforms = {};
			var uniformKeys = ['centre', 'fractalIterationDelta',
				'pixelSubsampling', 'scale'];
			var outer = this;
			uniformKeys.forEach(function(key) {
				outer.uniforms[key] = outer.gl.getUniformLocation(outer.pid, key);
			});
			document.addEventListener('sphere-radius-change', function() {
				outer.sphereRadiusChanged();
			});
			this.isVisible = false;
			this.updateVisibility();
		}

		loadShaders(gl, pid) {
			shader(gl, pid, 'script[type="glsl/vertex"]', gl.VERTEX_SHADER);
			shader(gl, pid, '#mandelbrot-fragment-shader', gl.FRAGMENT_SHADER);
			gl.linkProgram(pid);
			gl.useProgram(pid);
		}

		_drawMandelbrot(glDestination, pidDestination, w, h, uniforms) {
			var r = 2;
			if (sphereRadius !== undefined)
				r = sphereRadius.getValue();
			this.scale = getScaleFromDimensions(w, h) * 0.8 * r / 2.0;
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
				outer.g.clearRect(0,0,outer.w, outer.h);
				outer.g.drawImage(outer.latestImg, 0, 0);
				if (successCallback)
					successCallback();
			}
			else
			this.latestImg.addEventListener('load', function() {
				outer.g.clearRect(0,0,outer.w, outer.h);
				outer.g.drawImage(outer.latestImg, 0, 0);
				if (successCallback)
					successCallback();
			});
		}

		_drawCRealAndDot() {
			if (!this.isVisible) {
				return; // don't waste time if it won't show.
			}
			var outer = this;
			this._copyWebGLCanvas(function() {
				var rv = getCRealValue();
				var scale = outer.scale;
				rv = (rv / scale) + outer.w / 2;
				var lineThickness = 0.03 / scale;
				var circleRadius = 0.05 / scale;
				outer.g = outer.canvas.getContext('2d');
				outer.g.fillStyle = '#fff';
				outer.g.strokeStyle = '#000';
				outer.g.lineWidth = 0.01 / scale;
				outer.g.beginPath();
				outer.g.rect(rv, 0, lineThickness, outer.h);
				outer.g.closePath();
				outer.g.fill();
				outer.g.stroke();
				
				// if the cut plane is showing and the axis is z, show a dot.
				if (isPlaneCut() && getPlaneCutAxisValue() === 3) {
					var mandelbrotY = getPlaneCutValue() / outer.scale + outer.h / 2;
					outer.g.fillStyle = '#00f';
					outer.g.beginPath();
					outer.g.arc(rv, mandelbrotY, circleRadius, 0, Math.PI * 2);
					outer.g.closePath();
					outer.g.fill();
					outer.g.stroke();
				}
			});
		}
		
		_drawAll() {
			this._drawMandelbrot(this.gl, this.pid, this.w, this.h, this.uniforms);
			this.gl.finish();
			this._replaceWebGLImage();
			this._drawCRealAndDot();
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
			this.coords = this.gl.getAttribLocation(this.pid, 'coords');
			initCoords(this.gl, this.coords);
			this.uniforms = this.getUniforms([
				'ambientFactor', 'centre', 'circleRadiusRange', 'cReal',
				'fractalIterationDelta', 'isShowingCircumference', 'isShowingPlaneCut',
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
		
		_fillBlackBackground() {
			var g = this.g;
			g.fillStyle = '#000';
			g.beginPath();
			g.rect(0, 0, this.w, this.h);
			g.closePath();
			g.fill();
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
				pixelSubsamplingQuality = 5;
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
			'isShowingCircumference', 'isShowingPlaneCut',
			'lightDirection',
			'planeCutAxis', 'planeCutValue', 'sphereRadiusSquared',
			'sphereRadiusWithPlaneLineSquared', 'position3D', 'viewRotation'].forEach(function(key) {
				copyUniform(gl, outer.gl, pid, outer.pid, key);
			});
			this._fillBlackBackground();
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
				saveAs(blob, 'cloud.png');
				outer.isRenderingOrDownloading = false;
				outer._hideDownloadProgress();
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
				outer._ratioUpdated();
			});
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
	}
	
	function getPlaneCutValue() {
		return sanitizeFloat(planeCutValue.value, 0);
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

	function initCoords(gl, coords) {
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

	function getOpacityCutOffFromPeakSampleOpacity(newOpacity) {
		return 0.05 * newOpacity;
	}
	
	function getScaleFromDimensions(w, h) {
		return 7.0 / (w + h);
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
	gl.uniform3fv(locationOfPosition, [rotationRadius * Math.sin(newAngle), 0, rotationRadius * Math.cos(newAngle)]);
  }
  
  function isPlaneCut() {
	  return document.getElementById('show-plane').checked;
  }
  
  function improveFrameRateInResponseTo(currentFrameRate) {
	  if (currentFrameRate < 10) {
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
		  }
		  else {
			pixelStretch++;
			refreshPixelStretchCentreAndScale();
		  }
	  }
	  else if (currentFrameRate > 40) {
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
  }

  function processTimeChange() {
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
	  return (w + h) * 0.001;
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
  
  function getPlaneCutAxisValue() {
		var checkedPlaneCutAxisInput = document.querySelector('[name="plane-cut-axis"]:checked');
		return parseInt(checkedPlaneCutAxisInput.value);
  }
  
  function getCRealValue() {
	return sanitizeFloat(cRealInput.value, 0.7);
  }
  
  function initPlaneCutSettings() {
		var lightSettings = document.getElementById('light-settings');
		var showPlane = document.getElementById('show-plane');
		var wideColumn = document.getElementById('wide-column');

		function showPlaneCutUpdated() {
			if (!isPlaneCut()) {
				pixelSubsampling.useLowestQuality();
			}
			gl.uniform1i(locationOfIsShowingPlaneCut, isPlaneCut());
			if (isPlaneCut()) {
				wideColumn.setAttribute('class', 'show-plane-cut-settings');
			}
			else {
				wideColumn.setAttribute('class', 'show-light-settings');
			}
			mandelBrotDisplay.planeCutAxisChanged();
		}

		function planeCutChanged() {
			var val = getPlaneCutValue();
			gl.uniform1f(locationOfPlaneCutValue, val);
			mandelBrotDisplay.cRealUpdated();
		}
		
		function planeCutAxisChanged() {
			var val = getPlaneCutAxisValue();
			gl.uniform1i(locationOfPlaneCutAxis, val);
			mandelBrotDisplay.planeCutAxisChanged();
		}

		showPlane.addEventListener('change', showPlaneCutUpdated);
		planeCutValue.addEventListener('input', planeCutChanged);
		['x', 'y', 'z'].forEach(function(axisName) {
			var planeCutAxis = document.getElementById('plane-cut-axis-' + axisName);
			planeCutAxis.addEventListener('change', planeCutAxisChanged);
		});
		planeCutChanged();
		planeCutAxisChanged();
  }

  function updateAmbientUniform(gl, locationOfAmbient) {
	  var val = sanitizeFloat(ambientInput.value);
	  gl.uniform1f(locationOfAmbient, 1 - val);
  }
  
  function initSettings() {
	var body = document.querySelector('body');
	var settingsCloseButton = document.getElementById('collapse-settings-button');
	var settingsExpandButton = document.getElementById('expand-settings-button');
	var lightDirectionX = document.getElementById('light-x');
	var lightDirectionY = document.getElementById('light-y');
	var lightDirectionZ = document.getElementById('light-z');
	var maxIterations = document.getElementById('max-iterations');
	let locationOfFractalIterationDeltas = gl.getUniformLocation(pid, "fractalIterationDelta");
	let locationOfLightDirection = gl.getUniformLocation(pid, "lightDirection");
	let locationOfCReal = gl.getUniformLocation(pid, "cReal");
	let locationOfAmbient = gl.getUniformLocation(pid, "ambientFactor");

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
		updateAmbientUniform(gl, locationOfAmbient);
	}
	  
	function maxIterationsChanged() {
			var val = parseInt(maxIterations.value);
			if (typeof val !== 'number' || isNaN(val))
				val = 20;

			gl.uniform1f(locationOfFractalIterationDeltas, 1.0 / val);
			mandelBrotDisplay.maxIterationsChanged();
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
	  
	  showSphereOutlineInput.addEventListener('change', function() {
		showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h);
	  });
	  [lightDirectionX, lightDirectionY, lightDirectionZ].forEach(function(input) {
		input.addEventListener('input', lightDirectionChanged);
	  });
	maxIterations.addEventListener('input', maxIterationsChanged);
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