import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { SVGDrawingViewer } from '../../../modules/components/svg-drawing-viewer/SVGDrawingViewer.js';

export function testSVGDrawingViewer(logger) {
	setTimeout(function() {
		const e = document.createElement('div');
		e.style.height = '100px';
		e.style.width = '200px';
		document.querySelector('body').appendChild(e);
	// give a little time to load the dimensions properly before running the rest of the test.
		setTimeout(function() {
			const drawing = createTestDrawing();
			const viewer = new SVGDrawingViewer(e, drawing);
			viewer.zoomIn();
			viewer.zoomOut();
			viewer.setAspectRatio(1);
			const aspectWidth = viewer.getAspectWidth();
			if (typeof aspectWidth !== 'number')
				logger('Expected a number for aspectWidth but got ' + aspectWidth);
			e.remove();
		}, 0);
	}, 1000);
};