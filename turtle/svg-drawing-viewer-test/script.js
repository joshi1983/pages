import { CircleShape } from '../modules/drawing/vector/shapes/CircleShape.js';
import { createTestDrawing } from '../tests/helpers/createTestDrawing.js';
import { SVGDrawingViewer } from '../modules/components/svg-drawing-viewer/SVGDrawingViewer.js';
import { Vector3D } from '../modules/drawing/vector/Vector3D.js';

let initialized = false;
function init() {
	if (initialized)
		return;
	const e = document.getElementById('svg-viewer-test');
	const drawing = createTestDrawing();
	drawing.addForegroundShape(new CircleShape(new Vector3D(-300, 150, 0), 10));
	drawing.addForegroundShape(new CircleShape(new Vector3D(0, -250, 0), 10));
	const viewer = new SVGDrawingViewer(e, drawing);
	initialized = true;
	viewer.zoomIn();
	viewer.zoomOut();
}

document.addEventListener('DOMContentLoaded', function() {
	init();
});
setTimeout(init, 1000);