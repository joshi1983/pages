import { EventCoordinates } from '../EventCoordinates.js';
const listeners = [];

export function dragTranslation(container, transformer) {
	if (!(container instanceof Element))
		throw new Error('container must be an Element');
	if (typeof transformer !== 'object')
		throw new Error('transformer must be an object');

	let lastPosition = undefined;
	function down(event) {
		lastPosition = EventCoordinates.getRelativeXY(container, event);
	}

	function up(event) {
		lastPosition = undefined;
	}

	function move(event) {
		if (lastPosition !== undefined) {
			let newPosition = EventCoordinates.getRelativeXY(container, event);
			transformer.translateBy(newPosition.minus(lastPosition));
			lastPosition = newPosition;
		}
	}

	// unbind event listeners that may have been added by dragTranslation previously.
	listeners.forEach(function(listener) {
		['mousedown', 'mouseup', 'touchstart', 'mousemove', 'touchmove'].forEach(function(eventKey) {
			container.removeEventListener(eventKey, listener);
		});
	});
	listeners.push(down, up, move);

	const settings = {'passive': true};
	container.addEventListener('mousedown', down, settings);
	container.addEventListener('mouseup', up, settings);
	container.addEventListener('touchstart', down, settings);
	container.addEventListener('mousemove', move, settings);
	container.addEventListener('touchmove', move, settings);
};