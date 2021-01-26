document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.querySelector('canvas');
	var webglUtils = new WebGLUtils();

	function updateAnimation() {
		webglUtils.draw();
		requestAnimationFrame(updateAnimation);
	}

	updateAnimation();
	setUpDragUI(webglUtils);
	initFileSelector(webglUtils);
});