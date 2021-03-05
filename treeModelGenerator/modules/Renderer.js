import { Tree } from './Tree.js'
import { Triangle } from './Triangle.js'
import { Vertex } from './Vertex.js'

export class Renderer {
	constructor() {
		this.rotation = [0, 0, 0];
		this.canvas = document.querySelector('canvas');
		this._initWebGLContext();
		this.setTriangles(new Tree().getTriangles());
		var outer = this;

		function resized() {
			var size = outer._getCanvasSize();
			outer.canvas.setAttribute('width', size.w);
			outer.canvas.setAttribute('height', size.h);
			outer.gl.uniform1f(outer.uniforms.xScale, size.h / size.w);
			outer.gl.viewport(0, 0, size.w, size.h);
			outer.draw();
		}
		
		window.addEventListener('resize', resized);
		resized();
		this._initRotation();
	}

	_initRotation() {
		var outer = this;
		var previousT;

		function updateRotation() {
			var newT = new Date().getTime();
			var timeDelta;
			if (previousT !== undefined)
				timeDelta = newT - previousT;
			previousT = newT;
			if (timeDelta !== undefined) {
				outer.rotation[1] += timeDelta * 0.0005;
				outer._positionTransformUpdated();
				outer.draw();
			}
			requestAnimationFrame(updateRotation);
		}
		
		updateRotation();
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

	_initWebGLContext() {
		this.gl = this.canvas.getContext('webgl');
		this.program = this.gl.createProgram();
		loadShader(this.gl, this.program, vertexShaderCode, this.gl.VERTEX_SHADER);
		loadShader(this.gl, this.program, fragmentShaderCode, this.gl.FRAGMENT_SHADER);
		this.gl.linkProgram(this.program);
		this.gl.useProgram(this.program);
		this.uniforms = {
			'positionTransform': this.gl.getUniformLocation(this.program, 'positionTransform'),
			'xScale': this.gl.getUniformLocation(this.program, 'xScale')
		};
		
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
		this._positionTransformUpdated();
	}

	_bindVectorAttribute(key, arrayData) {
		this[key] = this.gl.getAttribLocation(this.program, key);
		let array = new Float32Array(arrayData);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
		this.gl.bufferData(this.gl.ARRAY_BUFFER, array, this.gl.STATIC_DRAW);

		this.gl.vertexAttribPointer(this[key], 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this[key]);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	_initAttributes() {
		this._bindVectorAttribute('position', this._getPosition());
		this._bindVectorAttribute('colour', this._getColourData());
	}

	setTriangles(newTriangles) {
		this.triangles = newTriangles;
		Vertex.scaleAndTranslate(Triangle.getVertices(newTriangles), 1.6);
		this._initAttributes();
	}

	_positionTransformUpdated() {
		var matrix = flattenArray(getRotationMatrix(this.rotation, true));
		this.gl.uniformMatrix3fv(this.uniforms.positionTransform, false, matrix);
	}

	setXRotation(newAngle) {
		this.rotation[0] = newAngle;
		this._positionTransformUpdated();
	}

	draw() {
		this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
		var range = this.gl.getParameter(this.gl.DEPTH_RANGE);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangles.length * 3);
	}
}