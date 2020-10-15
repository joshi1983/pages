"use strict"

window.addEventListener("DOMContentLoaded", function() {
  let showSphereOutlineInput = document.getElementById('show-outline');
  let canvas = document.querySelector('canvas');
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let pid = gl.createProgram();
  var h;
  var w;
  shader('glsl/vertex', gl.VERTEX_SHADER);
  shader('glsl/fragment', gl.FRAGMENT_SHADER);
  gl.linkProgram(pid);
  gl.useProgram(pid);
  let al = gl.getAttribLocation(pid, "coords");
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
  resized();

  let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

  gl.vertexAttribPointer(al, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(al);
 
  var times = [];
  var rotationRadius = 2.0;
  var oldMouseX, oldMouseY, oldTouchX, oldTouchY;

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
			this.locationOfSphereRadius = gl.getUniformLocation(pid, "sphereRadius");
			this.locationOfSphereRadiusSquared = gl.getUniformLocation(pid, "sphereRadiusSquared");
			this.locationOfSphereRadiusWithPlaneLineSquared = gl.getUniformLocation(pid, "sphereRadiusWithPlaneLineSquared");
			let outer = this;
			this.sphereRadiusInput.addEventListener('input', function() {
				outer._updated();
			});
			this._updated();
		}

		_updated() {
			let val = this.getValue();
			let val2 = val * (1 + getOutlineThickness() * scaleValue);
			gl.uniform1f(this.locationOfSphereRadius, val);
			gl.uniform1f(this.locationOfSphereRadiusSquared, val * val);
			gl.uniform1f(this.locationOfSphereRadiusWithPlaneLineSquared, val2 * val2);
			planeCutValue.setAttribute('min', -val);
			planeCutValue.setAttribute('max', val);
			planeCutValue.value = Math.max(-val, Math.min(val, planeCutValue.value));
		}

		getValue() {
			return sanitizeFloat(this.sphereRadiusInput.value, 2);
		}
	}

  var sphereRadius = new SphereRadius();
  var lightObstructionDeltaRatio = new LightObstructionDelta();
  var pixelSubsampling = new PixelSubsampling();

	function setSphereOutlineUniformOnly(newValue) {
	  gl.uniform1i(locationOfShowingCircumference, newValue);
	}

	function showSphereOutlineChanged() {
		  setSphereOutlineUniformOnly(!!showSphereOutlineInput.checked);
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
  
  function resized() {
	  w = window.innerWidth;
	  h = window.innerHeight;
	  
	  w /= pixelStretch;
	  h /= pixelStretch;
	  
	  canvas.setAttribute('width', Math.round(w));
	  canvas.setAttribute('height', Math.round(h));
	  gl.uniform2fv(locationOfCentre, [w / 2, h / 2]);
	  scaleValue = 7.0 / (w + h);
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
  
  function getOutlineThickness() {
	  return (w + h) * 0.001;
  }
  
  function getRadiusFromSphereRadius(sr) {
		var sinA = sr / rotationRadius;
		var a = Math.asin(sinA);
		var rad = Math.tan(a) / scaleValue;
		return rad;
  }

  function updateCircleRadiusRange() {
	var r = sphereRadius.getValue();
	if (r > 0.97 * rotationRadius) {
		setSphereOutlineUniformOnly(false);
		var size = sanitizeFloat(w + h, 18000);
		gl.uniform2fv(locationOfCircleRadiusRange, [size, size]);
	}
	else {
		showSphereOutlineChanged();
		// rotationRadius
		var min = getRadiusFromSphereRadius(r);
		var max = getRadiusFromSphereRadius(r * (1 + getOutlineThickness() * scaleValue));
		gl.uniform2fv(locationOfCircleRadiusRange, [min, max]);
	}
  }

  function draw() {
	processTimeChange();
	resized();
	updateCircleRadiusRange();
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
  
  function initSettings() {
	var body = document.querySelector('body');
	var settingsCloseButton = document.getElementById('collapse-settings-button');
	var settingsExpandButton = document.getElementById('expand-settings-button');
	var cRealInput = document.getElementById('c-real');
	var ambientInput = document.getElementById('ambient');
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
	  var val = sanitizeFloat(ambientInput.value);
	  gl.uniform1f(locationOfAmbient, 1 - val);
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
	  
	  showSphereOutlineInput.addEventListener('change', showSphereOutlineChanged);
	  [lightDirectionX, lightDirectionY, lightDirectionZ].forEach(function(input) {
		input.addEventListener('input', lightDirectionChanged);
	  });
	maxIterations.addEventListener('input', maxIterationsChanged);
	cRealInput.addEventListener('input', cRealChanged);
	settingsCloseButton.addEventListener('click', settingsClose);
	settingsExpandButton.addEventListener('click', settingsExpand);
	ambientInput.addEventListener('input', ambientChanged);
	showSphereOutlineChanged();
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