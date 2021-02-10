class Renderer {
	constructor() {
		this.rotation = [0, 0, 0];
		this.canvas = document.querySelector('canvas');
		this.viewpoint = [0, -0.003, -0.05];
		this._initWebGLContext();
		this._animatedObjects = [];
		this.scaleFactor = 0.0005;
		this.setTriangles(new MazeGenerator3D().getTriangles(15, 10));
		var outer = this;

		function resized() {
			outer.resized();
		}

		window.addEventListener('resize', resized);
		resized();
		this.__initRenderLoop();
	}

	addAnimatedObject(obj) {
		this._animatedObjects.push(obj);
	}

	__initRenderLoop() {
		var outer = this;
		function redraw() {
			outer._animatedObjects.forEach(function(animatedObject) {
				animatedObject.updateAnimation();
			});
			if (outer.needsRedraw)
				outer.draw();
			requestAnimationFrame(redraw);
		}
		redraw();
	}

	getScale() {
		var size = this._getCanvasSize();
		var overallScale = (size.w + size.h) * this.scaleFactor;
		return [overallScale, overallScale * size.w / size.h];
	}

	resized() {
		var size = this._getCanvasSize();
		this.canvas.setAttribute('width', size.w);
		this.canvas.setAttribute('height', size.h);
		var newScale = this.getScale();
		this.gl.uniform2fv(this.uniforms.scale, newScale);
		this.gl.viewport(0, 0, size.w, size.h);
		this.needsRedraw = true;
	}

	_getCanvasSize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		return {
			'w': w,
			'h': h
		};
	}

	_getPosition() {
		return flattenArray(this.triangles.map(function(triangle) {
			return triangle.getVertexCoordinates();
		}));
	}

	_getColourData() {
		return flattenArray(this.triangles.map(function(triangle) {
			return triangle.getVertexColours();
		}));
	}

	_loadTextures() {
		var wallURL = document.getElementById('brick-texture').getAttribute('src');
		var textureInfo = loadTexture(this.gl, wallURL);
		var texture = textureInfo.texture;

		// Tell WebGL we want to affect texture unit 0
		this.gl.activeTexture(this.gl.TEXTURE0);

		// Bind the texture to texture unit 0
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
		this.gl.uniform1i(this.uniforms.wallSampler, 0);
	}

	_initWebGLContext() {
		this.gl = this.canvas.getContext('webgl');
		this.program = this.gl.createProgram();
		loadShader(this.gl, this.program, vertexShaderCode, this.gl.VERTEX_SHADER);
		loadShader(this.gl, this.program, fragmentShaderCode, this.gl.FRAGMENT_SHADER);
		this.gl.linkProgram(this.program);
		this.gl.useProgram(this.program);
		this.uniforms = {
			'positionTransform': this.gl.getUniformLocation(this.program, 'positionTransform'),
			'scale': this.gl.getUniformLocation(this.program, 'scale'),
			'viewpoint': this.gl.getUniformLocation(this.program, 'viewpoint'),
			'wallSampler': this.gl.getUniformLocation(this.program, 'wallSampler')
		};
		this._loadTextures();
		this.gl.enable(this.gl.DEPTH_TEST);
		this.setViewpoint(this.viewpoint);
		this._positionTransformUpdated();
	}

	_bindVectorAttribute(key, arrayData, numPerVertex) {
		this[key] = this.gl.getAttribLocation(this.program, key);
		let array = new Float32Array(arrayData);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
		this.gl.bufferData(this.gl.ARRAY_BUFFER, array, this.gl.STATIC_DRAW);

		this.gl.vertexAttribPointer(this[key], numPerVertex, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this[key]);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	_initAttributes() {
		this._bindVectorAttribute('position', this._getPosition(), 3);
		this._bindVectorAttribute('colour', this._getColourData(), 3);
		this._bindVectorAttribute('textureCoordinates', Triangle.getTextureCoordinatesData(this.triangles), 2);
		//this._bindVectorAttribute('normal', Triangle.getNormalsData(this.triangles));
	}

	setViewpoint(newViewpoint) {
		if (newViewpoint === undefined)
			newViewpoint = this.viewpoint;
		if (!(newViewpoint instanceof Array) || newViewpoint.length !== 3) {
			console.error('newViewpoint = ' + JSON.stringify(newViewpoint));
			throw new Error('setViewpoint requires an array of 3 numbers');
		}
		this.viewpoint = newViewpoint;
		this.gl.uniform3fv(this.uniforms.viewpoint, this.viewpoint);
		this.needsRedraw = true;
	}

	getViewpoint() {
		return this.viewpoint.slice(0);
		// Return a clone in case the caller tries to modify it.
	}

	changeViewpointRotated(delta) {
		var x = delta * Math.sin(this.rotation[1]);
		var y = delta * Math.cos(this.rotation[1]);
		this.viewpoint[0] += x;
		this.viewpoint[2] += y;
		this.setViewpoint();
		this.needsRedraw = true;
	}

	setTriangles(newTriangles) {
		this.triangles = newTriangles;
		Vertex.scaleAndTranslate(Triangle.getVertices(newTriangles), 0.2);
		this._initAttributes();
		this.needsRedraw = true;
	}

	_positionTransformUpdated() {
		var matrix = flattenArray(getRotationMatrix(this.rotation, true));
		this.gl.uniformMatrix3fv(this.uniforms.positionTransform, false, matrix);
		this.needsRedraw = true;
	}

	setYRotation(newAngle) {
		this.rotation[1] = newAngle;
		this._positionTransformUpdated();
		this.needsRedraw = true;
	}

	draw() {
		this.needsRedraw = false;
		this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangles.length * 3);
	}
}