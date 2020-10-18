"use strict"

/*
Written by Josh Greig around October 17, 2020.
*/

window.addEventListener("DOMContentLoaded", function() {
  let showSphereOutlineInput = document.getElementById('show-outline');
  let canvas = document.querySelector('canvas');
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let pid = gl.createProgram();
  var h;
  var w;
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
  let rotationAngle = 0;
  let scaleValue = 100;
  var planeCutValue = document.getElementById('plane-cut-value');
  let pixelStretch = 1;
  var ambientInput = document.getElementById('ambient');
  resized();

	initCoords(gl, coords);
  var times = [];
  var rotationRadius = 2.0;
  var oldMouseX, oldMouseY, oldTouchX, oldTouchY;

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
				'lightDirection', 'lightObstructionDeltaRatio', 'peakSampleOpacity',
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
		
		startDownload() {
			this._showDownloadProgress();
			this.w = 1920;
			this.h = 1080;
			var lightObstructionDeltaRatio = 0.04;
			this.isRenderingOrDownloading = true;
			this.canvas2D.setAttribute('width', this.w);
			this.canvas2D.setAttribute('height', this.h);
			var scaleValue = getScaleFromDimensions(this.w, this.h);
			this.gl.uniform1f(this.uniforms.scale, scaleValue);
			updateCircleRadiusRange(this.gl, this.w, this.h, scaleValue, this.uniforms.circleRadiusRange);
			var pixelSubsamplingQuality = pixelSubsampling.DEFAULT_QUALITY;
			if (isPlaneCut())
				pixelSubsamplingQuality = 5;
			this.gl.uniform1i(this.uniforms.pixelSubsampling, pixelSubsamplingQuality);
			this.gl.uniform2fv(this.uniforms.centre, [this.w / 2, this.h / 2]);
			this.gl.uniform1f(this.uniforms.scale, getScaleFromDimensions(this.w, this.h));
			this.gl.uniform1f(this.uniforms.lightObstructionDeltaRatio, lightObstructionDeltaRatio);
			this.gl.uniform1f(this.uniforms.peakSampleOpacity, getPeakOpacityForLightObstructionDeltaRatio(lightObstructionDeltaRatio));
			
			sphereRadius.updateUniforms(this.gl, this.w, this.h, this.uniforms.sphereRadiusSquared,
				this.uniforms.sphereRadiusWithPlaneLineSquared);
			var outer = this;
			['ambientFactor', 'cReal', 'fractalIterationDelta',
			'isShowingCircumference', 'isShowingPlaneCut',
			'lightDirection',
			'planeCutAxis', 'planeCutValue', 'sphereRadiusSquared',
			'sphereRadiusWithPlaneLineSquared', 'position3D', 'viewRotation'].forEach(function(key) {
				var locationOfUniform = gl.getUniformLocation(pid, key);
				var destinationOfUniform = outer.gl.getUniformLocation(outer.pid, key);
				if (!locationOfUniform) {
					console.log('Weird.  Not found: ' + key + ', locationOfUniform: ', locationOfUniform);
				}
				var val = gl.getUniform(pid, locationOfUniform);
				var uniformFunc;
				if (typeof val === 'boolean') {
					uniformFunc = outer.gl.uniform1i;
				}
				else if (typeof val === 'number') {
					if (Math.floor(val) !== val)
						uniformFunc = outer.gl.uniform1f;
					else
						uniformFunc = outer.gl.uniform1i;
				}
				else if (val instanceof Float32Array) {
					if (val.length === 2)
						uniformFunc = outer.gl.uniform2fv;
					else
						uniformFunc = outer.gl.uniform3fv;
				}
				uniformFunc.call(outer.gl, destinationOfUniform, val);
			});
			this.left = 0;
			this.intervalSize = 5;
			this.canvasWebGL.setAttribute('width', this.intervalSize);
			this.canvasWebGL.setAttribute('height', this.h);
			requestAnimationFrame(function() {
				outer.updateDrawing();
			});
		}
		
		updateDrawing() {
			this.gl.uniform2fv(this.uniforms.centre, [this.w / 2 - this.left, this.h / 2]);
			drawGraphics(this.gl, this.intervalSize, this.h);
			var dataURL = this.canvasWebGL.toDataURL("image/png", 1.0);
			var img = new Image();
			var outer = this;
			img.onload = function() {
				outer.g.drawImage(img, outer.left, 0);
				outer._updateProgress();
				if (outer.left + outer.intervalSize >= outer.w) {
					outer.downloadCanvas();
				}
				else {
					outer.left += outer.intervalSize;
					requestAnimationFrame(function() {
						outer.updateDrawing();
					});
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
			}, 'image/png', 0.98);
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
			planeCutValue.value = Math.max(-val, Math.min(val, planeCutValue.value));
		}

		getValue() {
			return sanitizeFloat(this.sphereRadiusInput.value, 2);
		}
	}
	
	// This is an approximation.
	// The exact relationship wasn't found.
	function getPeakOpacityForLightObstructionDeltaRatio(lightObstructionDeltaRatio) {
		var x = lightObstructionDeltaRatio;
		var result = 0.1 + x * 0.6 + 3.2 * x * x;

		// sanitize into a valid range.
		result = Math.max(0.001, Math.min(1, result));
		return result;
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
		}

		setValueFromLightObstructionRatio(lightObstructionRatio) {
			this.lightObstructionRatio = lightObstructionRatio;
			this._updated();
		}
	}

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
	
	function getScaleFromDimensions(w, h) {
		return 7.0 / (w + h);
	}
  
  function resized() {
	  w = window.innerWidth;
	  h = window.innerHeight;
	  
	  w /= pixelStretch;
	  h /= pixelStretch;
	  
	  canvas.setAttribute('width', Math.round(w));
	  canvas.setAttribute('height', Math.round(h));
	  var cy = h / 2;
	  var body = document.querySelector('body');
	  var bodyClass = body.class;
	  if (!bodyClass)
		bodyClass = '';

	  // if the settings are showing and it is more than 0.3 * h,
	  // look for a better cy.
	  if (bodyClass.indexOf('settings-collapsed') === -1 && sphereRadius !== undefined) {
		  var settings = document.getElementById('settings');
		  var settingsHeight = settings.clientHeight;
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
	  gl.uniform2fv(locationOfCentre, [w / 2, cy]);
	  scaleValue = getScaleFromDimensions(w, h);
	  gl.uniform1f(locationOfScale, scaleValue);
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
			if (currentFrameRate < 5)
				pixelStretch++;
		  }
		  else {
			pixelStretch++;
		  }
	  }
	  else if (currentFrameRate > 40) {
		  if (pixelStretch > 1) {
			  pixelStretch--;
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

  function updateCircleRadiusRange(gl, w, h, scaleValue, locationOfCircleRadiusRange, locationOfShowingCircumference) {
	var r = sphereRadius.getValue();
	if (r > 0.97 * rotationRadius) {
		setSphereOutlineUniformOnly(gl, locationOfShowingCircumference, false);
		var size = sanitizeFloat(w + h, 18000);
		gl.uniform2fv(locationOfCircleRadiusRange, [size, size]);
	}
	else {
		showSphereOutlineChanged(gl, locationOfShowingCircumference, w, h);
		// rotationRadius
		var min = getRadiusFromSphereRadius(r, scaleValue);
		var max = getRadiusFromSphereRadius(r * (1 + getOutlineThickness(w, h) * scaleValue), scaleValue);
		gl.uniform2fv(locationOfCircleRadiusRange, [min, max]);
	}
  }
  
  function drawGraphics(gl, w, h) {
	gl.viewport(0, 0, w, h);
	gl.clearColor(0, 0, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function draw() {
	  if (!downloader.isDownloading()) {
		processTimeChange();
		resized();
		updateCircleRadiusRange(gl, w, h, scaleValue, locationOfCircleRadiusRange);
		drawGraphics(gl, w, h);
	  }
	requestAnimationFrame(draw);
  }
  
  function loadShaders(gl, pid) {
	  shader(gl, pid, 'glsl/vertex', gl.VERTEX_SHADER);
	  shader(gl, pid, 'glsl/fragment', gl.FRAGMENT_SHADER);
	  gl.linkProgram(pid);
	  gl.useProgram(pid);
  }

  function shader(gl, pid, name, type) {
    let src = [].slice.call(document.scripts).find(s => s.type === name).innerText;
    let sid = gl.createShader(type);
    gl.shaderSource(sid, src);
    gl.compileShader(sid);
    gl.attachShader(pid, sid);
  }
  
  function processDrag(dx, dy) {
		rotationAngle += dx * 0.002;
		rotationRadius += dy * 0.004;
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
		}

		function planeCutChanged() {
			var val = sanitizeFloat(planeCutValue.value, 0);
			gl.uniform1f(locationOfPlaneCutValue, val);
		}
		
		function planeCutAxisChanged() {
			var checkedPlaneCutAxisInput = document.querySelector('[name="plane-cut-axis"]:checked');
			var val = parseInt(checkedPlaneCutAxisInput.value);
			gl.uniform1i(locationOfPlaneCutAxis, val);
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
	var cRealInput = document.getElementById('c-real');
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
	}
	  
	  function cRealChanged() {
		  var val = sanitizeFloat(cRealInput.value, 0.7);
		  gl.uniform1f(locationOfCReal, val);
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
});