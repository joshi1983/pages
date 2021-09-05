import { EventCoordinates } from '../../components/EventCoordinates.js';
import { zoomFactor } from '../../components/MouseWheel.js';

export class MouseWheelZoomAdjuster {
	constructor(container, adjust) {
		if (!(container instanceof Element))
			throw new Error(`container must be an Element but got ${container}`);
		if (typeof adjust !== 'function')
			throw new Error(`adjust must be a function but got ${adjust}`);
		this.container = container;
		function listener(event) {
			const delta = EventCoordinates.getMouseWheelDelta(event);
			if (typeof delta === 'number' && !isNaN(delta)) {
				const scaleFactor = Math.pow(zoomFactor, Math.round(delta * 0.1));
				adjust(scaleFactor);
			}
		}
		this.listener = listener;
		this.container.addEventListener('wheel', listener, { 'passive': true });
	}

	unbind() {
		if (this.listener === undefined)
			throw new Error(`unbind() was already called and can't be called more than once for the same MouseWheelAdjuster`);
		this.container.removeEventListener('wheel', this.listener);
		this.listener = undefined;
		this.container = undefined;
	}
};