import { MouseWheelZoomAdjuster } from '../../../modules/drawing-menu/download/MouseWheelZoomAdjuster.js';

export function testMouseWheelZoomAdjuster(logger) {
	const container = document.createElement('div');
	function adjust(scale) {
		
	}
	const zoomAdjuster = new MouseWheelZoomAdjuster(container, adjust);
	zoomAdjuster.unbind();
};