import { createTestDrawing2 } from '../../helpers/createTestDrawing2.js';
import { dtoToSimplestDTO } from '../../../modules/drawing-menu/shape-explorer/serialization/dtoToSimplestDTO.js';
import { shapeToDTO } from '../../../modules/drawing-menu/shape-explorer/serialization/shapeToDTO.js';
import { SVGDrawingViewer } from '../../../modules/components/svg-drawing-viewer/SVGDrawingViewer.js';

function toJSON(drawing) {
	return JSON.stringify(drawing.foreground.shapes.map(shape => dtoToSimplestDTO(shapeToDTO(shape))));
}

export function testSVGDrawingViewerNotChangingDrawing(logger) {
	const drawing = createTestDrawing2();
	const shapesJSON = toJSON(drawing);
	const e = document.createElement('div');
		e.style.height = '100px';
		e.style.width = '200px';
		document.querySelector('body').appendChild(e);
	const viewer = new SVGDrawingViewer(e, drawing);
	setTimeout(function() {
		viewer.zoomIn();
		viewer.zoomIn();
		viewer.zoomOut();
		const shapesJSON2 = toJSON(drawing);
		if (shapesJSON !== shapesJSON2) {
			logger(`Expected matching JSON but got something else. Expected: ${shapesJSON} but got ${shapesJSON2}`);
		}
		e.remove();
	}, 1000);
};
