import { EventCoordinates } from '../components/EventCoordinates.js';
const listeners = [];

export function dragTranslation(container, camera, redraw) {
	let lastPosition = undefined;
	let isDirty = false;

	function redrawOnce() {
		if (isDirty)
			redraw();
		isDirty = false;
	}

	function delayedRedraw() {
		isDirty = true;
		setTimeout(redrawOnce, 5);
	}

	function down(event) {
		lastPosition = EventCoordinates.getRelativeXY(container, event);
	}

	function up(event) {
		lastPosition = undefined;
	}

	function move(event) {
		if (lastPosition !== undefined) {
			const newPosition = EventCoordinates.getRelativeXY(container, event);
			const delta = newPosition.minus(lastPosition);
			delta.setY(-delta.getY());
			camera.position.assign(camera.position.plus(delta.multiply(1/camera.getZoomScale())));
			lastPosition = newPosition;
			delayedRedraw();
			if (typeof event.preventDefault === 'function')
				event.preventDefault();
		}
	}

	// unbind event listeners that may have been added by dragTranslation previously.
	listeners.forEach(function(listener) {
		['mousedown', 'mouseup', 'touchstart', 'mousemove', 'touchmove'].forEach(function(eventKey) {
			container.removeEventListener(eventKey, listener);
		});
	});
	listeners.push(down, up, move);

	const settings = {'passive': false};
	container.addEventListener('mousedown', down, settings);
	container.addEventListener('mouseup', up, settings);
	container.addEventListener('touchstart', down, settings);
	container.addEventListener('mousemove', move, settings);
	container.addEventListener('touchmove', move, settings);
};