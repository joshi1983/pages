export function setUpDragUI(renderer) {
	var angle = 0;
	var previousMousePosition;
	
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
			angle += (newP.y - previousMousePosition.y) * 0.002;
			previousMousePosition = newP;
			renderer.setXRotation(angle);
		}
	}

	window.addEventListener('mousedown', mouseDown);
	window.addEventListener('touchstart', mouseDown);
	window.addEventListener('mouseup', mouseUp);
	window.addEventListener('touchend', mouseUp);
	window.addEventListener('mousemove', mouseMove);
	window.addEventListener('touchmove', mouseMove);
	renderer.setXRotation(angle);
}