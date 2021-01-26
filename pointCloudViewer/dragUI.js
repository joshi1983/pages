function setUpDragUI(webglUtils) {
	var y = 0;
	var angle = 0;
	var previousMousePosition;
	var previousT;

	function getPositionFromEvent(event) {
		if (event.touches !== undefined && event.touches[0] !== undefined) {
			var touch = event.touches[0];
			return {'x': touch.pageX, 'y': touch.pageY};
		}
		else {
			return {
				'x': event.clientX,
				'y': event.clientY
			};
		}
	}

	function mouseDown(event) {
		previousMousePosition = getPositionFromEvent(event);
	}

	function mouseUp() {
		previousMousePosition = undefined;
	}

	function mouseMove(event) {
		if (previousMousePosition !== undefined) {
			var newP = getPositionFromEvent(event);
			y += (previousMousePosition.y - newP.y) * 0.02;
			angle += (newP.x - previousMousePosition.x) * 0.001;
			previousMousePosition = newP;
			webglUtils.point.setYTranslation(y);
			webglUtils.point.setAngle(angle);
		}
	}

	function updateAngleRotationAnimation() {
		var t = new Date().getTime();
		if (previousT !== undefined) {
			angle += (t - previousT) * 0.0001;
			webglUtils.point.setAngle(angle);
		}
		previousT = t;
		requestAnimationFrame(updateAngleRotationAnimation);
	}

	window.addEventListener('mousedown', mouseDown);
	window.addEventListener('touchstart', mouseDown);
	window.addEventListener('mouseup', mouseUp);
	window.addEventListener('touchend', mouseUp);
	window.addEventListener('mousemove', mouseMove);
	window.addEventListener('touchmove', mouseMove);
	webglUtils.point.setYTranslation(y);
	updateAngleRotationAnimation();
}