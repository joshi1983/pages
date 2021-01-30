document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.querySelector('canvas');
	var gl = canvas.getContext('webgl');
	var program = gl.createProgram();
	var point = new Points(gl, program);
	point.loadShaders();
	gl.linkProgram(program);
	gl.useProgram(program);
	point.initCoords();
	gl.enable(gl.BLEND);
	gl.blendFunc (gl.ONE, gl.ONE);

	function draw() {
		var w = canvas.getAttribute('width');
		var h = canvas.getAttribute('height');
		gl.viewport(0, 0, w, h);
		gl.drawArrays(gl.POINTS, 0, point.coordinates.length / 3);
	}

	function resized() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		point.setScale((w + h) * 0.0003, w / h);
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		requestAnimationFrame(draw);
	}

	function updateAnimation() {
		var t = new Date().getTime();
		point.setAngle((t * 0.0001) % (2 * Math.PI));
		point.setDistance(80 * Math.sin(t * 0.0005));
		draw();
		requestAnimationFrame(updateAnimation);
	}

	resized();
	window.addEventListener('resize', resized);
	setUpDragUI(point);
	updateAnimation();
});