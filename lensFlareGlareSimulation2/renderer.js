class Renderer {
	constructor(colour) {
		this.canvas = document.querySelector('canvas');
		this.colourReader = colour;
		this.points = [new Point([0, 0], [25, 12, 4])];
		this._initShadersAndUniforms();
		var brightnessInput = document.getElementById('brightness-coefficient');
		var outer = this;

		function brightnessUpdated() {
			outer.setBrightness(parseFloat(brightnessInput.value));
			outer.draw();
		}
		brightnessInput.addEventListener('input', brightnessUpdated);
		brightnessUpdated();

		function resized() {
			var size = outer._getCanvasSize();
			outer.canvas.setAttribute('width', size.w);
			outer.canvas.setAttribute('height', size.h);
			if (outer.uniforms) {
				outer.gl.uniform2fv(outer.uniforms.viewportScale, [2 / size.w, -2/ size.h]);
			}
			outer.draw();
		}

		window.addEventListener('resize', resized);
		resized();
	}

	_getCanvasSize() {
		var settingsDiv = document.querySelector('.input-controls');
		var w = window.innerWidth;
		var h = window.innerHeight - settingsDiv.clientHeight;		
		return {
			'w': w,
			'h': h
		};
	}

	_initShadersAndUniforms() {
		this.gl = this.canvas.getContext('webgl');
		this.program = this.gl.createProgram();
		loadShader(this.gl, this.program, vertexShaderCode, this.gl.VERTEX_SHADER);
		loadShader(this.gl, this.program, fragmentShaderCode, this.gl.FRAGMENT_SHADER);
		this.gl.linkProgram(this.program);
		this.gl.useProgram(this.program);

		this._bindPoints();
		this.uniforms = {
			'brightness': this.gl.getUniformLocation(this.program, 'brightness'),
			'viewportScale': this.gl.getUniformLocation(this.program, 'viewportScale')
		};
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
	}

	_flattenArray(a) {
		var result = [];
		a.forEach(function(ae) {
			ae.forEach(function(ae1) {
				result.push(ae1);
			});
		});
		return result;
	}

	_getPointPositions() {
		return this._flattenArray(this.points.map(function(point) {
			return point.position;
		}));
	}

	_getPointColours() {
		return this._flattenArray(this.points.map(function(point) {
			return point.colour;
		}));
	}

	_bindVectorAttribute(key, componentsPerVertex, arrayData) {
		this[key] = this.gl.getAttribLocation(this.program, key);
		let array = new Float32Array(arrayData);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
		this.gl.bufferData(this.gl.ARRAY_BUFFER, array, this.gl.STATIC_DRAW);

		this.gl.vertexAttribPointer(this[key], componentsPerVertex, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this[key]);
	}

	_bindPoints() {
		this._bindVectorAttribute('position', 2, this._getPointPositions());
		this._bindVectorAttribute('colour', 3, this._getPointColours());
	}

	_pointsUpdated() {
		this._bindPoints();
	}

	draw() {
		if (this.position === undefined || this.colour === undefined)
			return; // avoid an error.
		var w = this.canvas.getAttribute('width');
		var h = this.canvas.getAttribute('height');
		this.gl.viewport(0, 0, w, h);
		this.gl.drawArrays(this.gl.POINTS, 0, this.points.length);
	}

	setBrightness(newBrightness) {
		this.gl.uniform1f(this.uniforms.brightness, newBrightness);
	}

	addPoint(position) {
		var size = this._getCanvasSize();
		position[1] -= size.h / 2;
		position[0] -= size.w / 2;
		this.points.push(new Point(position, this.colourReader.getColour()));
		this._pointsUpdated();
		this.draw();
	}

	removeAllPoints() {
		this.points = [];
		this._pointsUpdated();
		this.draw();
	}
}