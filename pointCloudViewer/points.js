class Points {
	constructor(gl, program, pointsData) {
		this.gl = gl;
		this.program = program;
		this.coloursData = getPointColoursData(pointsData);
		this.coordinates = getPointCoordinatesData(pointsData);
		this.vertexShaderCode = `
precision mediump float;
attribute vec3 position;
attribute vec3 colour;
uniform vec3 scale;
uniform mat3 transform;
uniform float distance;
uniform float yTranslation;
uniform float dotSizeScale;
uniform float brightnessRatio;
varying vec3 pointColour;

void main() {
	vec3 transformedPosition = position;
	transformedPosition = transformedPosition * transform;
	transformedPosition.x = transformedPosition.x * scale.x;
	transformedPosition.y = transformedPosition.y * scale.y + yTranslation;
	transformedPosition.z += 40.0 + distance;
	gl_Position = vec4(transformedPosition.xy / transformedPosition.z, 0.0, 1.0);
	float brightnessScale = max(colour.r, max(colour.g, colour.b));
	gl_PointSize = dotSizeScale * scale.z * brightnessScale / transformedPosition.z;
	pointColour = colour * brightnessRatio / brightnessScale;
}`;
		this.fragmentShaderCode = `
precision mediump float;
varying vec3 pointColour;

void main() {
	mediump float distance = length(2.0 * gl_PointCoord - 1.0);
	if (distance > 1.0) {
		discard; // do not draw this pixel.
	}
	else {
		distance = (1.0 - distance) * 1.0;
		gl_FragColor = vec4(pointColour * distance, 1.0);
	}
}`;
	}

	_initVec3Attribute(key, attributeName, initData) {
		this[key] = this.gl.getAttribLocation(this.program, attributeName);
		let array = new Float32Array(initData);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
		this.gl.bufferData(this.gl.ARRAY_BUFFER, array, this.gl.STATIC_DRAW);

		this.gl.vertexAttribPointer(this[key], 3 /*components per vertex */, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this[key]);
	}

	initCoords() {
		this.uniforms = {
			'scale': this.gl.getUniformLocation(this.program, 'scale'),
			'transform': this.gl.getUniformLocation(this.program, 'transform'),
			'distance': this.gl.getUniformLocation(this.program, 'distance'),
			'yTranslation': this.gl.getUniformLocation(this.program, 'yTranslation'),
			'dotSizeScale': this.gl.getUniformLocation(this.program, 'dotSizeScale'),
			'brightnessRatio': this.gl.getUniformLocation(this.program, 'brightnessRatio')
		};

		this._initVec3Attribute('coords', 'position', this.coordinates);
		this._initVec3Attribute('colours', 'colour', this.coloursData);
		
		this.setAngle(0);
	}

	setDotSizeScale(newDotSizeScale) {
		this.gl.uniform1f(this.uniforms.dotSizeScale, newDotSizeScale);
	}

	setBrightnessRatio(newBrightnessRatio) {
		this.gl.uniform1f(this.uniforms.brightnessRatio, newBrightnessRatio);
	}

	setScale(newScale, aspectRatio) {
		newScale = [newScale, newScale * aspectRatio, newScale];
		this.gl.uniform3fv(this.uniforms.scale, newScale);
	}

	setAngle(newRotation) {
		if (this.uniforms === undefined) {
			console.error('unable to setAngle because this.uniforms is undefined.');
			return;
		}
		var sinTheta = Math.sin(newRotation);
		var cosTheta = Math.cos(newRotation);
		var matrix = [
			cosTheta, 0, sinTheta,
			0, 1, 0,
			-sinTheta, 0, cosTheta
		];
		this.gl.uniformMatrix3fv(this.uniforms.transform, false, matrix);
	}

	setDistance(newDistance) {
		this.gl.uniform1f(this.uniforms.distance, newDistance);
	}

	setYTranslation(newYTranslation) {
		this.gl.uniform1f(this.uniforms.yTranslation, newYTranslation);
	}

	loadShaders() {
		loadShader(this.gl, this.program, this.vertexShaderCode, this.gl.VERTEX_SHADER);
		loadShader(this.gl, this.program, this.fragmentShaderCode, this.gl.FRAGMENT_SHADER);
	}
}