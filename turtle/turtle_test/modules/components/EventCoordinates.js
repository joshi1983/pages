import { Vector2D } from '../drawing/vector/Vector2D.js';

class PrivateEventCoordinates {
	getRelativeXY(element, event) {
		if (!(element instanceof Element))
			throw new Error('element must be a Element');
		if (typeof event !== 'object')
			throw new Error('event must be an object');

		let x = event.clientX;
		let y = event.clientY;
		if ((x === undefined || y === undefined) && event.touches.length > 0) {
			const touch = event.touches[0];
			x = touch.clientX;
			y = touch.clientY;
		}
		if (!isNaN(x) && !isNaN(y)) {
			const rect = element.getBoundingClientRect();
			x -= rect.left;
			y -= rect.top;
			return new Vector2D(x, y);
		}
		else
			throw new Error('Unable to get x and y coordinates');
	}

	getMouseWheelDelta(e) {
		if (!e)
			e = window.event;
		return e.wheelDelta || -e.detail;
	}
}

const EventCoordinates = new PrivateEventCoordinates();
export { EventCoordinates };