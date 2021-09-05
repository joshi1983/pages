import { pdfDownload } from './pdfDownload.js';
import { Transformer } from '../../../components/svg-drawing-viewer/Transformer.js';
import { VectorDrawing } from '../../../drawing/vector/VectorDrawing.js';

export function downloadClicked(viewer, drawing, widthInches, heightInches) {
	const transformer = viewer.transformer;
	const transformer2 = new Transformer(widthInches, heightInches);
	const aspectWidth = viewer.getAspectWidth();
	const scaleFactor = widthInches / aspectWidth;
	transformer2.scale = transformer.scale * scaleFactor;
	const translationFromCentre = transformer.translation.minus(transformer.getCentreOffset().multiply(1 / transformer.scale));
	transformer2.translation = translationFromCentre.plus(transformer2.getCentreOffset().multiply(1 / transformer2.scale));
	const _drawing = new VectorDrawing();
	const camera = transformer2.toCamera();
	_drawing.setScreenColor(drawing.getScreenColor());
	_drawing.addForegroundShapes(drawing.getShapesArray().map(shape => shape.transformBy(camera)));
	pdfDownload(_drawing, widthInches, heightInches, 'download.pdf');
};