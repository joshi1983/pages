import { EventCoordinates } from '../../../components/EventCoordinates.js';
import { zoomFactor } from '../../../components/MouseWheel.js';

const listeners = [];

function unbind(container) {
	if (!(container instanceof Element))
		throw new Error('container must be an Element');
	listeners.forEach(function(listener) {
		container.removeEventListener('wheel', listener);
	});
}

export function mouseWheelZoom(container, previewer) {
	if (!(container instanceof Element))
		throw new Error('container must be an Element');

	const mouseWheelMoved = function(event) {
		const delta = EventCoordinates.getMouseWheelDelta(event);
		if (typeof delta === 'number' && !isNaN(delta)) {
			const scaleFactor = Math.pow(zoomFactor, Math.round(delta * 0.1));
			previewer.multiplyScaleBy(scaleFactor);
		}
		else
			console.error('Expected delta to be a number but got delta = ' + delta);
	};
	unbind(container); // avoid binding the same element more than once.
	listeners.push(mouseWheelMoved);

	container.addEventListener('wheel', mouseWheelMoved, { passive: true });
};