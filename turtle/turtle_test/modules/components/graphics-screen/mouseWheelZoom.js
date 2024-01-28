import { EventCoordinates } from '../EventCoordinates.js';
import { GraphicsScreen } from '../GraphicsScreen.js';
const container = GraphicsScreen.container;

function mouseWheelMoved(event) {
	const delta = EventCoordinates.getMouseWheelDelta(event);
	if (typeof delta === 'number' && !isNaN(delta)) {
		const scaleFactor = Math.pow(1.01, delta * 0.1);
		GraphicsScreen.setZoomScale(GraphicsScreen.getZoomScale() * scaleFactor);
		GraphicsScreen.redraw();
	}
	else
		console.error('Expected delta to be a number but got delta = ' + delta);
}

container.addEventListener('wheel', mouseWheelMoved, { passive: true });