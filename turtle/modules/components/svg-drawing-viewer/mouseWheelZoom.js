import { EventCoordinates } from '../EventCoordinates.js';
import { SVGTransformer } from './SVGTransformer.js';
import { zoomFactor } from '../MouseWheel.js';

const listeners = [];

function unbind(container) {
	if (!(container instanceof Element))
		throw new Error('container must be an Element');
	listeners.forEach(function(listener) {
		container.removeEventListener('wheel', listener);
	});
}

export function mouseWheelZoom(container, transformer) {
	if (!(container instanceof Element))
		throw new Error('container must be an Element');
	if (!(transformer instanceof SVGTransformer))
		throw new Error('transformer must be an SVGTransformer');

	const mouseWheelMoved = function(event) {
		const delta = EventCoordinates.getMouseWheelDelta(event);
		if (typeof delta === 'number' && !isNaN(delta)) {
			const scaleFactor = Math.pow(zoomFactor, delta * 0.1);
			transformer.multiplyScaleBy(scaleFactor);
		}
		else
			console.error('Expected delta to be a number but got delta = ' + delta);
	};
	unbind(container); // avoid binding the same element more than once.
	listeners.push(mouseWheelMoved);

	container.addEventListener('wheel', mouseWheelMoved, { 'passive': true });
};