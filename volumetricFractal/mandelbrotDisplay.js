
class MandelbrotDisplay {
	constructor(gl, pid, pixelStretch, sphereRadius, displayMode, 
	planeCutValue, cRealValue, planeCutAxis, scale, circles,
	getViewportDimensions, getCentre) {
		this.mainGL = gl;
		this.mainPID = pid;
		this.pixelStretch = pixelStretch;
		this.sphereRadius = sphereRadius;
		this.displayMode = displayMode;
		this.planeCutValue = planeCutValue;
		this.cRealValue = cRealValue;
		this.planeCutAxis = planeCutAxis;
		this.scale = scale;
		this.circles = circles;
		this.getViewportDimensions = getViewportDimensions;
		this.getCentre = getCentre;

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
			'pixelSubsampling', 'scale', 'smoothenColours'];
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
		if (this.sphereRadius !== undefined)
			r = this.sphereRadius.get();
		return this.scale.getScaleFromDimensions(w, h) * 0.8 * r / 2.0;
	}

	_drawMandelbrot(glDestination, pidDestination, w, h, uniforms) {
		this.scaleNumber = this._getScaleFrom(w, h);
		glDestination.uniform1i(uniforms.pixelSubsampling, 2);
		glDestination.uniform1f(uniforms.scale, this.scaleNumber);
		glDestination.uniform2fv(uniforms.centre, [w/2, h/2]);
		this.sphereRadius.updateUniforms(glDestination, w, h,
			uniforms.sphereRadiusSquared, uniforms.sphereRadiusWithPlaneLineSquared);
		var outer = this;
		['fractalIterationDelta', 'smoothenColours'].forEach(function(key) {
			copyUniform(outer.mainGL, glDestination, outer.mainPID, pidDestination, key);
		});
		drawGraphics(glDestination, w, h);
	}
	
	shouldBeVisible() {
		// would this mandelbrot display overlap the sphere?
		var dimensions = this.getViewportDimensions();
		var w = dimensions[0];
		var h = dimensions[1];
		var size = this._getSizeFromFullCanvas(w, h);
		var scaleValue = this.scale.getScaleFromDimensions(w, h);
		if (typeof scaleValue !== 'number' || isNaN(scaleValue))
			throw new Error('scaleValue must be a number.');
		var radius = this.circles.getMaxCircleRadius(w, h, scaleValue);
		if (typeof radius !== 'number' || isNaN(radius))
			throw new Error('radius must be a number.');
		var centre = this.getCentre();
		if (!(centre instanceof Array) || centre.length !== 2) {
			throw new Error('centre must be an Array of length 2.');
		}
		centre = [centre[0] * this.pixelStretch, centre[1] * this.pixelStretch];
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

	smoothenedColoursChanged() {
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
		var rv = this.cRealValue.get();
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
		if (this.displayMode.isPlaneCut() && this.planeCutAxis.get() === 3 && circleRadius > 0) {
			var mandelbrotY = offsetY + this.planeCutValue.get() / scale + h / 2;
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
			outer._drawLineAndDot(outer.g, outer.scaleNumber, outer.w, outer.h, 0);
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

				freeWebGLContext(info.gl);
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
		var dimensions = this.getViewportDimensions();
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
