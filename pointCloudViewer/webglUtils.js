class WebGLUtils {
	constructor() {
		this.canvas = document.querySelector('canvas');
		this.__init();
		var outer = this;
		window.addEventListener('resize', function() {
			outer.resized();
		});
		this.resized();
	}

	__init(pointsData) {
		this.gl = this.canvas.getContext('webgl');
		this.program = this.gl.createProgram();
		this.point = new Points(this.gl, this.program, pointsData);
		this.point.loadShaders();
		this.gl.linkProgram(this.program);
		this.gl.useProgram(this.program);
		this.point.initCoords();
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
		this._updateDotSizeScale();
	}
	
	_updateDotSizeScale() {
		var w = this.canvas.getAttribute('width');
		var h = this.canvas.getAttribute('height');
		var brightnessRatio = 1;
		var newDotSizeScale = 0.0000008 * Math.sqrt(this.point.coordinates.length) * (w + h);
		if (newDotSizeScale < 60) {
			brightnessRatio = newDotSizeScale / 60.0;
		}
		newDotSizeScale = Math.min(1000, Math.max(100, newDotSizeScale));
		this.point.setDotSizeScale(newDotSizeScale);
		this.point.setBrightnessRatio(brightnessRatio);
	}

	setPoints(points) {
		this.point.coloursData = getPointColoursData(points);
		this.point.coordinates = getPointCoordinatesData(points, 35);
		this.point.initCoords();
	}

	draw() {
		var w = this.canvas.getAttribute('width');
		var h = this.canvas.getAttribute('height');
		this.gl.viewport(0, 0, w, h);
		this.gl.drawArrays(this.gl.POINTS, 0, this.point.coordinates.length / 3);
	}

	resized() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		this.point.setScale((w + h) * 0.0003, w / h);
		this.canvas.setAttribute('width', w);
		this.canvas.setAttribute('height', h);
		var outer = this;
		requestAnimationFrame(function() {
			outer._updateDotSizeScale();
			outer.draw();
		});
	}
}