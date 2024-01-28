import { EventCoordinates } from '../components/EventCoordinates.js';
import { zoomFactor } from '../components/MouseWheel.js';

export function mouseWheel(displayElement, camera, redraw) {
	displayElement.addEventListener('wheel', function(event) {
		const delta = EventCoordinates.getMouseWheelDelta(event);
		if (typeof delta === 'number' && !isNaN(delta)) {
			const scaleFactor = Math.pow(zoomFactor, delta * 0.1);
			camera.setZoomScale(camera.getZoomScale() * scaleFactor);
			redraw();
		}
	});
};